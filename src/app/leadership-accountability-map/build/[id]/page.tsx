import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { BuildController } from "@/components/accountability/BuildController";
import {
  getMap,
  getRoles,
  isStorageConfigured,
} from "@/lib/accountability/storage";

export const metadata: Metadata = {
  title: "Build your Leadership Accountability Map",
};

type Params = Promise<{ id: string }>;

export default async function AccountabilityBuildPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  if (!isStorageConfigured()) return <StorageNotConfigured />;

  const mapRes = await getMap(id);
  if (!mapRes.ok) return <BuildError />;
  if (!mapRes.data) notFound();
  if (mapRes.data.status !== "in_progress") {
    redirect(`/leadership-accountability-map/saved/${id}`);
  }

  const rolesRes = await getRoles(id);
  if (!rolesRes.ok) return <BuildError />;

  const initialRoles = rolesRes.data.map((r) => ({
    include: true,
    position: r.position,
    role_type: r.role_type,
    role_name: r.role_name,
    owner_name: r.owner_name,
    mission_statement: r.mission_statement,
    responsibility_1: r.responsibility_1,
    responsibility_2: r.responsibility_2,
    responsibility_3: r.responsibility_3,
    responsibility_4: r.responsibility_4,
    responsibility_5: r.responsibility_5,
    accountable_to: r.accountable_to,
    is_custom: Boolean(r.is_custom),
  }));

  return (
    <section className="section-padding bg-background">
      <div className="container-wide max-w-4xl">
        <BuildController
          mapId={id}
          initialRoles={initialRoles}
          initialReflection={{
            reflection_date_1: mapRes.data.reflection_date_1,
            reflection_date_2: mapRes.data.reflection_date_2,
            reflection_date_3: mapRes.data.reflection_date_3,
            reflection_question: mapRes.data.reflection_question,
          }}
          firstName={mapRes.data.first_name}
          companyName={mapRes.data.company_name}
        />
      </div>
    </section>
  );
}

function StorageNotConfigured() {
  return (
    <section className="section-padding bg-gradient-hero">
      <div className="container-narrow max-w-xl text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-accent-dark" />
        <h1 className="mt-4 font-velocity text-foreground text-4xl uppercase tracking-wider">
          Storage not configured
        </h1>
      </div>
    </section>
  );
}

function BuildError() {
  return (
    <section className="section-padding bg-gradient-hero">
      <div className="container-narrow max-w-xl text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
        <h1 className="mt-4 font-velocity text-foreground text-4xl uppercase tracking-wider">
          Couldn&rsquo;t load your map
        </h1>
      </div>
    </section>
  );
}
