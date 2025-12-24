import { useSearch } from "@tanstack/react-router";
import { t } from "i18next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const redirect = useSearch({
    from: "/auth/login",
    select: (search) => search.redirect,
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t("auth.welcomeBack")}</CardTitle>
          <CardDescription>{t("auth.loginWithGitHubAccount")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() =>
                    authClient.signIn.social({
                      provider: "github",
                      callbackURL: redirect,
                    })
                  }
                >
                  {t("auth.loginWithGitHub")}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() =>
                    authClient.signIn.social({
                      provider: "gitlab",
                      callbackURL: redirect,
                    })
                  }
                >
                  {t("auth.loginWithGitLab")}
                </Button>
              </Field>
              {/* <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </Field>
              <Field>
                <Button type="submit">Login</Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription>
              </Field> */}
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        {t("auth.byClickingContinue")}{" "}
        <a href="#">{t("auth.termsOfService")}</a> {t("auth.and")}{" "}
        <a href="#">{t("auth.privacyPolicy")}</a>.
      </FieldDescription>
    </div>
  );
}
