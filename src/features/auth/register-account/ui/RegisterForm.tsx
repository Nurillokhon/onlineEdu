/** @format */

import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TextField,
  FormField,
  PhoneField,
  PasswordField,
  CaptchaField,
  Notice,
  ActionButton,
  RefreshIcon,
  CheckBadgeIcon,
  MailIcon,
} from "@/shared/ui";
import {
  useAuth,
  useCitizenLookupMutation,
  useRegisterMutation,
} from "@/entities/user";
import type { Citizen } from "@/entities/user";
import { paths } from "@/shared/config/routes";
import {
  isPhoneComplete,
  toApiPhone,
  toPinfl,
  isPinflComplete,
  toPassport,
  isPassportComplete,
  passwordStrength,
  useCaptcha,
} from "@/shared/lib";

type FieldErrors = Partial<
  Record<
    | "pinfl"
    | "passport"
    | "phone"
    | "email"
    | "password"
    | "captcha"
    | "consent",
    string
  >
>;

function initialsOf(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

export function RegisterForm() {
  const [pinfl, setPinfl] = useState("");
  const [passport, setPassport] = useState("");
  const [citizen, setCitizen] = useState<Citizen | null>(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");

  const captcha = useCaptcha();
  const { login } = useAuth();
  const lookupMutation = useCitizenLookupMutation();
  const registerMutation = useRegisterMutation();
  const navigate = useNavigate();

  const strength = passwordStrength(password);

  function handleLookup() {
    const nextErrors: FieldErrors = {};
    if (!isPinflComplete(pinfl))
      nextErrors.pinfl = "JShShIR 14 xonali bo'lishi kerak.";
    if (!isPassportComplete(passport))
      nextErrors.passport = "Pasport seriyasi va raqamini kiriting.";
    setErrors(nextErrors);
    setFormError("");
    if (Object.keys(nextErrors).length > 0) return;

    lookupMutation.mutate(
      { pinfl, passport },
      {
        onSuccess: setCitizen,
        onError: () => {
          setCitizen(null);
          setFormError(
            "Ma'lumotlarni yuklab bo'lmadi. Keyinroq qayta urinib ko'ring.",
          );
        },
      },
    );
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: FieldErrors = {};
    if (!citizen)
      nextErrors.pinfl = "Avval IIV bazasidan ma'lumotlarni yuklang.";
    if (!isPhoneComplete(phone))
      nextErrors.phone = "Telefon raqamini to'liq kiriting.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      nextErrors.email = "Pochta manzili noto'g'ri.";
    if (!strength.meetsPolicy) {
      nextErrors.password =
        "Kamida 8 ta belgi, katta harf va maxsus belgi kerak.";
    }
    if (!captcha.isCorrect) nextErrors.captcha = "Javob noto'g'ri.";
    if (!consent) nextErrors.consent = "Rozilikni tasdiqlang.";

    setErrors(nextErrors);
    setFormError("");
    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors.captcha) captcha.refresh();
      return;
    }

    registerMutation.mutate(
      {
        pinfl,
        passport,
        name: citizen?.name ?? "",
        phone: toApiPhone(phone),
        email,
        password,
      },
      {
        onSuccess: (user) => {
          login(user);
          navigate(paths.courses, { replace: true });
        },
        onError: () => {
          setFormError(
            "Ro'yxatdan o'tishda xatolik yuz berdi. Qayta urinib ko'ring.",
          );
          captcha.refresh();
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold text-brand">
          Ro'yxatdan o'tish
        </h1>
        <p className="text-ink-muted text-sm mt-1">
          Platformadan foydalanish uchun hisob yarating
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="JShShIR">
          <TextField
            ariaLabel="JShShIR"
            placeholder="14 xonali raqam"
            value={pinfl}
            format={toPinfl}
            onChange={setPinfl}
            errorText={errors.pinfl}
          />
        </FormField>
        <FormField label="Pasport seriyasi va raqami">
          <TextField
            ariaLabel="Pasport seriyasi va raqami"
            placeholder="AA 1234567"
            value={passport}
            format={toPassport}
            onChange={setPassport}
            errorText={errors.passport}
          />
        </FormField>
      </div>

      <div className="flex justify-end">
        <ActionButton
          onClick={handleLookup}
          disabled={lookupMutation.isPending}
          icon={<RefreshIcon size={16} />}
        >
          {lookupMutation.isPending ? "Yuklanmoqda…" : "IIV bazasidan yuklash"}
        </ActionButton>
      </div>

      {citizen ? (
        <div className="rounded-xl bg-brand-softer border border-line px-4 py-4 flex flex-col gap-3">
          <p className="text-sm font-semibold text-ink flex items-center gap-2">
            Tasdiqlangan ma'lumotlar
            <span className="text-brand-hover">
              <CheckBadgeIcon size={16} />
            </span>
          </p>
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-lg bg-brand-soft text-brand font-semibold flex items-center justify-center">
              {initialsOf(citizen.name)}
            </span>
            <div>
              <p className="text-ink font-medium">{citizen.name}</p>
              <p className="text-ink-muted text-sm">{citizen.address}</p>
            </div>
          </div>
        </div>
      ) : null}

      <PhoneField value={phone} onChange={setPhone} errorText={errors.phone} />

      <FormField label="Elektron pochta">
        <TextField
          ariaLabel="Elektron pochta"
          type="email"
          placeholder="misol@mail.com"
          value={email}
          onChange={setEmail}
          errorText={errors.email}
          leadingIcon={<MailIcon />}
        />
      </FormField>

      <div className="flex flex-col gap-1.5">
        <PasswordField
          value={password}
          onChange={setPassword}
          errorText={errors.password}
        />
        <div
          className="h-1.5 mt-1 rounded-full bg-line overflow-hidden"
          role="progressbar"
          aria-label="Parol kuchliligi"
          aria-valuemin={0}
          aria-valuemax={4}
          aria-valuenow={strength.score}
        >
          <span
            className={`block h-full rounded-full transition-all ${
              strength.score <= 1
                ? "bg-danger"
                : strength.score <= 2
                  ? "bg-brand-hover"
                  : "bg-brand"
            }`}
            style={{ width: `${(strength.score / 4) * 100}%` }}
          />
        </div>
        <p className="text-xs text-ink-muted">
          Kamida 8 ta belgi, katta harf va maxsus belgi
          {strength.label ? ` — ${strength.label}` : ""}
        </p>
      </div>

      <CaptchaField
        question={captcha.question}
        value={captcha.answer}
        onChange={captcha.setAnswer}
        onRefresh={captcha.refresh}
        errorText={errors.captcha}
      />

      <div className="flex flex-col gap-1.5">
        <label className="flex items-start gap-3 text-sm text-ink">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-0.5 w-4 h-4 accent-brand"
          />
          Men shaxsiy ma'lumotlarimni qayta ishlashga rozilik bildiraman.
        </label>
        {errors.consent ? (
          <p className="text-sm text-danger">{errors.consent}</p>
        ) : null}
      </div>

      {formError ? <Notice alert>{formError}</Notice> : null}

      <ActionButton
        type="submit"
        fullWidth
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? "Ro'yxatdan o'tilmoqda…" : "Davom etish"}
      </ActionButton>

      <p className="text-sm text-center text-ink-muted">
        Akkountingiz bormi?{" "}
        <Link
          to={paths.login}
          className="text-brand font-medium hover:underline"
        >
          Kiring
        </Link>
      </p>
    </form>
  );
}
