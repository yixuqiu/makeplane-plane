import { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { Controller, useForm } from "react-hook-form";
// icons
import { CircleCheck } from "lucide-react";
// ui
import { Button, Input, TOAST_TYPE, getButtonStyling, setToast } from "@plane/ui";
// components
import { PageHead } from "@/components/core";
// constants
import { FORGOT_PASS_LINK, NAVIGATE_TO_SIGNUP } from "@/constants/event-tracker";
// helpers
import { EPageTypes } from "@/helpers/authentication.helper";
import { cn } from "@/helpers/common.helper";
import { checkEmailValidity } from "@/helpers/string.helper";
// hooks
import { useEventTracker } from "@/hooks/store";
import useTimer from "@/hooks/use-timer";
// layouts
import DefaultLayout from "@/layouts/default-layout";
// lib
import { NextPageWithLayout } from "@/lib/types";
// wrappers
import { AuthenticationWrapper } from "@/lib/wrappers";
// services
import { AuthService } from "@/services/auth.service";
// images
import PlaneBackgroundPatternDark from "public/auth/background-pattern-dark.svg";
import PlaneBackgroundPattern from "public/auth/background-pattern.svg";
import BluePlaneLogoWithoutText from "public/plane-logos/blue-without-text.png";

type TForgotPasswordFormValues = {
  email: string;
};

const defaultValues: TForgotPasswordFormValues = {
  email: "",
};

// services
const authService = new AuthService();

const ForgotPasswordPage: NextPageWithLayout = () => {
  // router
  const router = useRouter();
  const { email } = router.query;
  // store hooks
  const { captureEvent } = useEventTracker();
  // hooks
  const { resolvedTheme } = useTheme();
  // timer
  const { timer: resendTimerCode, setTimer: setResendCodeTimer } = useTimer(0);

  // form info
  const {
    control,
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
  } = useForm<TForgotPasswordFormValues>({
    defaultValues: {
      ...defaultValues,
      email: email?.toString() ?? "",
    },
  });

  const handleForgotPassword = async (formData: TForgotPasswordFormValues) => {
    await authService
      .sendResetPasswordLink({
        email: formData.email,
      })
      .then(() => {
        captureEvent(FORGOT_PASS_LINK, {
          state: "SUCCESS",
        });
        setToast({
          type: TOAST_TYPE.SUCCESS,
          title: "Email sent",
          message:
            "Check your inbox for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.",
        });
        setResendCodeTimer(30);
      })
      .catch((err) => {
        captureEvent(FORGOT_PASS_LINK, {
          state: "FAILED",
        });
        setToast({
          type: TOAST_TYPE.ERROR,
          title: "Error!",
          message: err?.error ?? "Something went wrong. Please try again.",
        });
      });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <PageHead title="Forgot Password" />
      <div className="absolute inset-0 z-0">
        <Image
          src={resolvedTheme === "dark" ? PlaneBackgroundPatternDark : PlaneBackgroundPattern}
          className="w-full h-full object-cover"
          alt="Plane background pattern"
        />
      </div>
      <div className="relative z-10 w-screen h-screen overflow-hidden overflow-y-auto flex flex-col">
        <div className="container mx-auto px-10 lg:px-0 flex-shrink-0 relative flex items-center justify-between pb-4 transition-all">
          <div className="flex items-center gap-x-2 py-10">
            <Image src={BluePlaneLogoWithoutText} height={30} width={30} alt="Plane Logo" />
            <span className="text-2xl font-semibold sm:text-3xl">Plane</span>
          </div>
          <div className="text-center text-sm font-medium text-onboarding-text-300">
            New to Plane?{" "}
            <Link
              href="/"
              onClick={() => captureEvent(NAVIGATE_TO_SIGNUP, {})}
              className="font-semibold text-custom-primary-100 hover:underline"
            >
              Create an account
            </Link>
          </div>
        </div>
        <div className="flex-grow container mx-auto max-w-lg px-10 lg:max-w-md lg:px-5 py-10 lg:pt-28 transition-all">
          <div className="relative flex flex-col space-y-6">
            <div className="text-center space-y-1 py-4">
              <h3 className="flex gap-4 justify-center text-3xl font-bold text-onboarding-text-100">
                Reset your password
              </h3>
              <p className="font-medium text-onboarding-text-400">
                Enter your user account{"'"}s verified email address and we will send you a password reset link.
              </p>
            </div>
            <form onSubmit={handleSubmit(handleForgotPassword)} className="mt-5 space-y-4">
              <div className="space-y-1">
                <label className="text-sm text-onboarding-text-300 font-medium" htmlFor="email">
                  Email
                </label>
                <Controller
                  control={control}
                  name="email"
                  rules={{
                    required: "Email is required",
                    validate: (value) => checkEmailValidity(value) || "Email is invalid",
                  }}
                  render={({ field: { value, onChange, ref } }) => (
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={value}
                      onChange={onChange}
                      ref={ref}
                      hasError={Boolean(errors.email)}
                      placeholder="name@company.com"
                      className="h-[46px] w-full border border-onboarding-border-100 !bg-onboarding-background-200 pr-12 placeholder:text-onboarding-text-400"
                      disabled={resendTimerCode > 0}
                    />
                  )}
                />
                {resendTimerCode > 0 && (
                  <p className="flex w-full items-start px-1 gap-1 text-xs font-medium text-green-700">
                    <CircleCheck height={12} width={12} className="mt-0.5" />
                    We sent the reset link to your email address
                  </p>
                )}
              </div>
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                size="lg"
                disabled={!isValid}
                loading={isSubmitting || resendTimerCode > 0}
              >
                {resendTimerCode > 0 ? `Resend in ${resendTimerCode} seconds` : "Send reset link"}
              </Button>
              <Link href="/accounts/sign-in" className={cn("w-full", getButtonStyling("link-neutral", "lg"))}>
                Back to sign in
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

ForgotPasswordPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <DefaultLayout>
      <AuthenticationWrapper pageType={EPageTypes.NON_AUTHENTICATED}>{page}</AuthenticationWrapper>
    </DefaultLayout>
  );
};

export default ForgotPasswordPage;
