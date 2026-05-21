import {
  BadRequestException, Controller, Get, Param, Post, Req, Res, UseGuards, UploadedFile, UseInterceptors, HttpException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtUser } from '../auth/jwt.strategy';

interface MulterFile { fieldname: string; originalname: string; mimetype: string; size: number; buffer: Buffer }

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_BYTES = 5 * 1024 * 1024; // 5MB

function ext(mime: string): string {
  return ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' } as const)[mime] || 'bin';
}

@Controller('uploads')
export class UploadsController {
  private readonly storageUrl = process.env.STORAGE_URL!;
  private readonly storageKey = process.env.STORAGE_SERVICE_KEY!;
  private readonly bucket = process.env.STORAGE_BUCKET || 'apprevista';

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_BYTES } }))
  async upload(@Req() req: { user: JwtUser }, @UploadedFile() file: MulterFile) {
    if (!file) throw new BadRequestException('Arquivo ausente');
    if (!ALLOWED_MIMES.includes(file.mimetype)) {
      throw new BadRequestException(`Tipo não permitido: ${file.mimetype}`);
    }

    const path = `${req.user.sub}/${Date.now()}-${randomUUID()}.${ext(file.mimetype)}`;
    const r = await fetch(`${this.storageUrl}/object/${this.bucket}/${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.storageKey}`,
        'Content-Type': file.mimetype,
        'Cache-Control': 'public, max-age=31536000',
      },
      body: new Uint8Array(file.buffer),
    });
    if (!r.ok) {
      const txt = await r.text();
      throw new HttpException(`Storage error: ${txt}`, r.status);
    }
    return {
      path,
      url: `/api/v1/uploads/${this.bucket}/${path}`,
    };
  }

  // ── Stream público (sem JWT) — bucket é público
  @Get(':bucket/:userId/:filename')
  async download(
    @Param('bucket') bucket: string,
    @Param('userId') userId: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const path = `${userId}/${filename}`;
    const r = await fetch(`${this.storageUrl}/object/public/${bucket}/${path}`);
    if (!r.ok || !r.body) {
      res.status(r.status === 200 ? 502 : r.status).send(`Erro: ${r.statusText}`);
      return;
    }
    const ct = r.headers.get('content-type');
    if (ct) res.setHeader('Content-Type', ct);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    const reader = r.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    res.end();
  }
}
