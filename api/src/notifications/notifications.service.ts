import { Injectable, Logger, Inject } from '@nestjs/common';
import { Resend } from 'resend';
import postgres from 'postgres';
import { SQL } from '../database/database.module';

const FROM = process.env.NOTIFY_FROM || 'App Revista <no-reply@apprevista.com.br>';
const APP_URL = process.env.APP_URL || 'https://apprevista.com.br';

@Injectable()
export class NotificationsService {
  private readonly log = new Logger('Notifications');
  private resend: Resend | null = null;

  constructor(@Inject(SQL) private sql: postgres.Sql) {
    const key = process.env.RESEND_API_KEY;
    if (key) this.resend = new Resend(key);
    else this.log.warn('RESEND_API_KEY ausente — emails não serão enviados');
  }

  private async donoEmail(condoId: string): Promise<{ email: string; nome: string; condo: string } | null> {
    const [r] = await this.sql<{ email: string; nome: string; condo: string }[]>`
      SELECT u.email, u.nome, c.nome AS condo
      FROM condominios c
      JOIN usuarios_cache u ON u.id = c.dono_id
      WHERE c.id = ${condoId} AND c.bloqueado = false
    `;
    return r || null;
  }

  private async enviar(to: string, subject: string, html: string) {
    if (!this.resend) return;
    try {
      await this.resend.emails.send({ from: FROM, to, subject, html });
    } catch (e) {
      this.log.error(`Falha ao enviar email para ${to}: ${(e as Error).message}`);
    }
  }

  async chamadoNovo(condoId: string, codigo: string, titulo: string, prioridade: string) {
    const d = await this.donoEmail(condoId);
    if (!d) return;
    const html = `
      <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
        <h2 style="color:#1E3A5F">🔧 Novo chamado em ${escapeHtml(d.condo)}</h2>
        <p>Olá ${escapeHtml(d.nome)},</p>
        <p>Um morador abriu um novo chamado:</p>
        <div style="background:#F1F5F9;border-radius:8px;padding:16px;margin:16px 0">
          <p style="margin:0;font-weight:bold">${escapeHtml(titulo)}</p>
          <p style="margin:8px 0 0;color:#64748B;font-size:14px">Código: <code>${escapeHtml(codigo)}</code> · Prioridade: ${escapeHtml(prioridade)}</p>
        </div>
        <p><a href="${APP_URL}/painel/${condoId}/chamados" style="background:#1E3A5F;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block">Abrir no painel</a></p>
        <p style="color:#94A3B8;font-size:12px;margin-top:32px">Você está recebendo este email porque é responsável pelo condomínio ${escapeHtml(d.condo)} no App Revista.</p>
      </div>
    `;
    await this.enviar(d.email, `[App Revista] Novo chamado: ${titulo}`, html);
  }

  async classificadoNovo(condoId: string, titulo: string, tipo: string) {
    const d = await this.donoEmail(condoId);
    if (!d) return;
    const html = `
      <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px">
        <h2 style="color:#1E3A5F">🏷️ Novo classificado em ${escapeHtml(d.condo)}</h2>
        <p>Olá ${escapeHtml(d.nome)},</p>
        <p>Um morador publicou um novo anúncio aguardando moderação:</p>
        <div style="background:#F1F5F9;border-radius:8px;padding:16px;margin:16px 0">
          <p style="margin:0;font-weight:bold">${escapeHtml(titulo)}</p>
          <p style="margin:8px 0 0;color:#64748B;font-size:14px">Tipo: ${escapeHtml(tipo)}</p>
        </div>
        <p><a href="${APP_URL}/painel/${condoId}/classificados" style="background:#1E3A5F;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block">Moderar agora</a></p>
        <p style="color:#94A3B8;font-size:12px;margin-top:32px">Você está recebendo este email porque é responsável pelo condomínio ${escapeHtml(d.condo)} no App Revista.</p>
      </div>
    `;
    await this.enviar(d.email, `[App Revista] Novo classificado pendente: ${titulo}`, html);
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
