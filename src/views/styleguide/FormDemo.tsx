"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { eventInquiryContent } from "@/lib/content/eventInquiry";
import { TextField, TextareaField } from "@/components/forms/Field";
import { ChoiceCards } from "@/components/forms/ChoiceCards";
import { YesNoRow } from "@/components/forms/YesNoRow";
import { Consent } from "@/components/forms/Consent";
import { FormStep } from "@/components/forms/FormStep";

/** Live form parts with their states for the styleguide – texts from the event inquiry. */
export function FormDemo({ locale }: { locale: Locale }) {
  const f = eventInquiryContent[locale].form;
  const [occasion, setOccasion] = useState(f.occasion.options[0].value);
  const [coach, setCoach] = useState(false);
  return (
    <div className="grid gap-8 rounded-[28px] border border-fg/10 bg-raised pad-banner">
      <FormStep number={1} title={f.steps.event} />
      <div className="grid gap-6 md:grid-cols-2">
        <TextField id="sg-field" label={f.groupSize.label} required placeholder={f.groupSize.placeholder} hint={f.date.hint} />
        <TextField id="sg-field-error" label={f.groupSize.label} required placeholder={f.groupSize.placeholder} error={f.errors.groupSize} />
      </div>
      <ChoiceCards name="sg-choice" legend={f.occasion.label} options={f.occasion.options} value={occasion} onChange={setOccasion} required />
      <ChoiceCards name="sg-choice-error" legend={f.occasion.label} options={f.occasion.options} value="" onChange={() => {}} required error={f.errors.occasion} />
      <div className="divide-y divide-fg/10 rounded-[20px] border border-fg/10">
        <YesNoRow name="sg-addon" title={f.addons[0].title} text={f.addons[0].text} yes={f.yes} no={f.no} value={coach} onChange={setCoach} />
      </div>
      <TextareaField id="sg-textarea" label={f.details.label} optional={f.optional} placeholder={f.details.placeholder} hint={f.details.hint} rows={3} />
      <Consent locale={locale} id="sg-consent" />
      <Consent locale={locale} id="sg-consent-error" error={f.errors.consent} />
    </div>
  );
}
