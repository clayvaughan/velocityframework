import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { BuildController } from "@/components/messaging/BuildController";
import {
  getChecklist,
  getCollateralItems,
  isStorageConfigured,
} from "@/lib/messaging/storage";
import {
  COLLATERAL_ITEMS,
  type CollateralItemKey,
  type CollateralStatus,
} from "@/lib/messaging/constants";

export const metadata: Metadata = {
  title: "Build your Messaging & Proof Checklist",
};

type Params = Promise<{ id: string }>;

export default async function MessagingBuildPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  if (!isStorageConfigured()) return <StorageNotConfigured />;

  const c = await getChecklist(id);
  if (!c.ok) return <BuildError />;
  if (!c.data) notFound();
  if (c.data.status !== "in_progress") {
    redirect(`/messaging-proof-checklist/saved/${id}`);
  }

  const ci = await getCollateralItems(id);
  if (!ci.ok) return <BuildError />;
  const collateralMap: Record<
    CollateralItemKey,
    { status: CollateralStatus | null; notes: string }
  > = {} as Record<CollateralItemKey, { status: CollateralStatus | null; notes: string }>;
  for (const item of COLLATERAL_ITEMS) {
    const found = ci.data.find((x) => x.item_key === item.key);
    collateralMap[item.key] = {
      status: found ? found.status : null,
      notes: found?.notes ?? "",
    };
  }

  return (
    <>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide max-w-4xl">
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-accent-dark">
            Messaging &amp; Proof Checklist · Build
          </p>
          <h1 className="mt-4 font-velocity text-foreground text-4xl md:text-5xl uppercase tracking-wider leading-[0.95]">
            {c.data.company_name}&rsquo;s messaging, locked.
          </h1>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-wide max-w-4xl">
          <BuildController
            checklistId={id}
            favoriteCustomer={c.data.favorite_customer}
            initialChecklist={{
              oneliner_problem: c.data.oneliner_problem,
              oneliner_solution: c.data.oneliner_solution,
              oneliner_success: c.data.oneliner_success,
              oneliner_final: c.data.oneliner_final,
              message_top_of_funnel: c.data.message_top_of_funnel,
              message_middle_of_funnel: c.data.message_middle_of_funnel,
              message_bottom_of_funnel: c.data.message_bottom_of_funnel,
              message_post_purchase: c.data.message_post_purchase,
              case_customer: c.data.case_customer,
              case_problem: c.data.case_problem,
              case_why_chose_you: c.data.case_why_chose_you,
              case_what_you_did: c.data.case_what_you_did,
              case_result: c.data.case_result,
              case_friend_quote: c.data.case_friend_quote,
              testimonial_outreach_notes: c.data.testimonial_outreach_notes,
              cta_home_direct: c.data.cta_home_direct,
              cta_home_transitional: c.data.cta_home_transitional,
              cta_product_direct: c.data.cta_product_direct,
              cta_product_transitional: c.data.cta_product_transitional,
              cta_email_direct: c.data.cta_email_direct,
              cta_email_transitional: c.data.cta_email_transitional,
            }}
            initialCollateral={collateralMap}
          />
        </div>
      </section>
    </>
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
          Couldn&rsquo;t load your checklist
        </h1>
      </div>
    </section>
  );
}
