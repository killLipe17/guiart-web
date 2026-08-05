import {
  AtSign,
  CircleCheckBig,
  ClipboardList,
  Clock3,
  FolderKanban,
  LayoutDashboard,
  MapPin,
  MessageCircle,
  Package,
  Save,
  Settings2,
  Smartphone,
  Store,
  TriangleAlert,
  Warehouse,
} from "lucide-react";
import Link from "next/link";

import { updateStoreSettingsAction } from "@/app/admin/configuracoes/actions";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getStoreSettings } from "@/lib/store-settings";

export const dynamic = "force-dynamic";

type AdminSettingsPageProps = {
  searchParams: Promise<{
    success?: string | string[];
    error?: string | string[];
  }>;
};

function getSingleSearchParam(
  value: string | string[] | undefined
) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export default async function AdminSettingsPage({
  searchParams,
}: AdminSettingsPageProps) {
  await requireAdmin();

  const [
    resolvedSearchParams,
    settings,
  ] = await Promise.all([
    searchParams,
    getStoreSettings(),
  ]);

  const successMessage =
    getSingleSearchParam(
      resolvedSearchParams.success
    );

  const errorMessage =
    getSingleSearchParam(
      resolvedSearchParams.error
    );

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 border-b border-zinc-800 pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-yellow-400">
              Painel administrativo
            </p>

            <h1 className="mt-3 text-3xl font-black sm:text-4xl">
              Configurações da loja
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
              Centralize os dados de contato,
              redes sociais, endereço e mensagens
              usadas no site.
            </p>
          </div>

          <nav className="flex flex-wrap gap-2">
            <Link
              href="/admin"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-sm font-semibold text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-400"
            >
              <LayoutDashboard size={18} />
              Painel
            </Link>

            <Link
              href="/admin/produtos"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-sm font-semibold text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-400"
            >
              <Package size={18} />
              Produtos
            </Link>

            <Link
              href="/admin/pedidos"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-sm font-semibold text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-400"
            >
              <ClipboardList size={18} />
              Pedidos
            </Link>

            <Link
              href="/admin/estoque"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-sm font-semibold text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-400"
            >
              <Warehouse size={18} />
              Estoque
            </Link>

            <Link
              href="/admin/categorias"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-sm font-semibold text-zinc-300 transition hover:border-yellow-400/40 hover:text-yellow-400"
            >
              <FolderKanban size={18} />
              Categorias
            </Link>

            <LogoutButton />
          </nav>
        </header>

        {successMessage && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-4 text-emerald-300">
            <CircleCheckBig
              size={21}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm font-semibold">
              {successMessage}
            </p>
          </div>
        )}

        {errorMessage && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-4 text-red-300">
            <TriangleAlert
              size={21}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm font-semibold">
              {errorMessage}
            </p>
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 px-5 py-4">
          <div className="flex items-start gap-3">
            <Settings2
              size={20}
              className="mt-0.5 shrink-0 text-yellow-400"
            />

            <p className="text-sm leading-6 text-zinc-400">
              Nesta primeira etapa, os dados ficam
              salvos no banco. Na próxima etapa,
              vamos ligar todas as páginas públicas
              a estas configurações.
            </p>
          </div>
        </div>

        <form
          action={updateStoreSettingsAction}
          className="mt-8 space-y-6"
        >
          <SettingsSection
            icon={<Store size={23} />}
            title="Identidade da loja"
            description="Nome exibido no site e nos contatos."
          >
            <Field
              label="Nome da loja"
              htmlFor="storeName"
              description="Nome comercial completo."
            >
              <input
                id="storeName"
                name="storeName"
                type="text"
                required
                minLength={2}
                maxLength={100}
                defaultValue={
                  settings.storeName
                }
                className={inputClassName}
              />
            </Field>
          </SettingsSection>

          <SettingsSection
            icon={<MessageCircle size={23} />}
            title="WhatsApp"
            description="Número, forma de exibição e mensagem inicial."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Número para links"
                htmlFor="whatsappNumber"
                description="Somente DDI, DDD e número. Ex.: 5511962222045."
              >
                <input
                  id="whatsappNumber"
                  name="whatsappNumber"
                  type="text"
                  inputMode="numeric"
                  required
                  maxLength={20}
                  defaultValue={
                    settings.whatsappNumber
                  }
                  className={inputClassName}
                />
              </Field>

              <Field
                label="Número exibido"
                htmlFor="whatsappDisplay"
                description="Como o telefone aparecerá para o cliente."
              >
                <input
                  id="whatsappDisplay"
                  name="whatsappDisplay"
                  type="text"
                  required
                  maxLength={40}
                  defaultValue={
                    settings.whatsappDisplay
                  }
                  className={inputClassName}
                />
              </Field>
            </div>

            <Field
              label="Mensagem padrão"
              htmlFor="whatsappMessage"
              description="Texto inicial ao abrir uma conversa pelo site."
            >
              <textarea
                id="whatsappMessage"
                name="whatsappMessage"
                required
                minLength={3}
                maxLength={800}
                rows={4}
                defaultValue={
                  settings.whatsappMessage
                }
                className={textareaClassName}
              />
            </Field>
          </SettingsSection>

          <SettingsSection
            icon={<AtSign size={23} />}
            title="Redes sociais"
            description="Links e nomes de usuário usados no rodapé e em outras áreas."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="URL do Instagram"
                htmlFor="instagramUrl"
                description="Link completo do perfil."
              >
                <input
                  id="instagramUrl"
                  name="instagramUrl"
                  type="url"
                  required
                  maxLength={300}
                  defaultValue={
                    settings.instagramUrl
                  }
                  className={inputClassName}
                />
              </Field>

              <Field
                label="Usuário do Instagram"
                htmlFor="instagramHandle"
                description="Ex.: @guiart_games"
              >
                <div className="relative">
                  <AtSign
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                  />

                  <input
                    id="instagramHandle"
                    name="instagramHandle"
                    type="text"
                    required
                    maxLength={60}
                    defaultValue={
                      settings.instagramHandle
                    }
                    className={`${inputClassName} pl-11`}
                  />
                </div>
              </Field>

              <Field
                label="URL do TikTok"
                htmlFor="tiktokUrl"
                description="Campo opcional."
              >
                <input
                  id="tiktokUrl"
                  name="tiktokUrl"
                  type="url"
                  maxLength={300}
                  defaultValue={
                    settings.tiktokUrl
                  }
                  className={inputClassName}
                />
              </Field>

              <Field
                label="Usuário do TikTok"
                htmlFor="tiktokHandle"
                description="Ex.: @Guiart_Games"
              >
                <div className="relative">
                  <Smartphone
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
                  />

                  <input
                    id="tiktokHandle"
                    name="tiktokHandle"
                    type="text"
                    maxLength={60}
                    defaultValue={
                      settings.tiktokHandle
                    }
                    className={`${inputClassName} pl-11`}
                  />
                </div>
              </Field>
            </div>
          </SettingsSection>

          <SettingsSection
            icon={<MapPin size={23} />}
            title="Loja física"
            description="Endereço, referência, horário e retirada."
          >
            <Field
              label="Endereço completo"
              htmlFor="address"
              description="Inclua rua, número, loja, bairro, cidade, estado e CEP."
            >
              <textarea
                id="address"
                name="address"
                required
                minLength={5}
                maxLength={400}
                rows={3}
                defaultValue={
                  settings.address
                }
                className={textareaClassName}
              />
            </Field>

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Referência"
                htmlFor="addressReference"
                description="Ex.: Próximo ao Metrô Jabaquara."
              >
                <input
                  id="addressReference"
                  name="addressReference"
                  type="text"
                  maxLength={160}
                  defaultValue={
                    settings.addressReference
                  }
                  className={inputClassName}
                />
              </Field>

              <Field
                label="Horário de funcionamento"
                htmlFor="businessHours"
                description="Pode ter mais de uma linha."
              >
                <textarea
                  id="businessHours"
                  name="businessHours"
                  maxLength={500}
                  rows={3}
                  defaultValue={
                    settings.businessHours
                  }
                  className={textareaClassName}
                />
              </Field>
            </div>

            <Field
              label="Aviso de retirada"
              htmlFor="pickupNotice"
              description="Informação mostrada ao cliente sobre retirada na loja."
            >
              <textarea
                id="pickupNotice"
                name="pickupNotice"
                maxLength={500}
                rows={3}
                defaultValue={
                  settings.pickupNotice
                }
                className={textareaClassName}
              />
            </Field>
          </SettingsSection>

          <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Clock3
                  size={18}
                  className="text-zinc-500"
                />

                <p className="text-sm font-bold">
                  Última atualização
                </p>
              </div>

              <p className="mt-2 text-xs text-zinc-600">
                {settings.updatedAt.toLocaleString(
                  "pt-BR",
                  {
                    timeZone:
                      "America/Sao_Paulo",
                  }
                )}
              </p>
            </div>

            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 text-sm font-black text-black transition hover:bg-yellow-300"
            >
              <Save size={18} />
              Salvar configurações
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

const inputClassName =
  "h-12 w-full rounded-xl border border-zinc-800 bg-black px-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400";

const textareaClassName =
  "w-full resize-y rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-400";

type SettingsSectionProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
};

function SettingsSection({
  icon,
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
      <div className="flex items-start gap-4 border-b border-zinc-800 px-5 py-5 sm:px-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400">
          {icon}
        </div>

        <div>
          <h2 className="text-xl font-black">
            {title}
          </h2>

          <p className="mt-1 text-sm leading-6 text-zinc-500">
            {description}
          </p>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        {children}
      </div>
    </section>
  );
}

type FieldProps = {
  label: string;
  htmlFor: string;
  description?: string;
  children: React.ReactNode;
};

function Field({
  label,
  htmlFor,
  description,
  children,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="text-sm font-bold text-zinc-300"
      >
        {label}
      </label>

      {description && (
        <p className="mt-1 text-xs leading-5 text-zinc-600">
          {description}
        </p>
      )}

      <div className="mt-2">
        {children}
      </div>
    </div>
  );
}
