import { type ReactEventHandler, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useMessageBus } from "src/hooks";

import { Button } from "./Button";
import { Input } from "./Input";

type LoginForm = {
  username: string;
  password: string;
};

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const [isLoginIn, toggleLogin] = useState(false);
  const { pushMessage } = useMessageBus();

  const onSubmit = useCallback<ReactEventHandler>(
    (event) =>
      handleSubmit(async (form) => {
        toggleLogin(true);
        try {
          const response = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify(form),
          });
          const { access_token, ...message } = await response.json();
          pushMessage(message);
          if (response.ok) {
            localStorage.setItem("poke_deck_astro_token", access_token);
            location.assign("/home");
          } else {
            toggleLogin(false);
          }
        } catch (err) {
          throw err;
        }
      })(event).catch((error) => {
        console.log(error);
      }),
    [],
  );

  return (
    <div className="flex items-center justify-center relative font-fredoka w-full">
      <div className="flex items-center justify-center w-full">
        <form
          className="flex flex-col gap-5 sm:rounded-lg text-xl bg-purple-900 p-5 
            sm:shadow-[0px_0px_20px_5px] sm:shadow-zinc-600/50 w-full max-w-2xl
            shadow-none rounded-none"
          onSubmit={onSubmit}
        >
          <Input
            id="username"
            label="Username:"
            labelStyles="text-2xl"
            inputStyles="text-2xl h-14"
            errorStyles="text-lg"
            error={errors.username?.message}
            {...register("username", {
              required: "You should type you username",
            })}
          />
          <Input
            id="password"
            label="Password:"
            type="password"
            inputStyles="text-2xl h-14"
            labelStyles="text-2xl"
            errorStyles="text-lg"
            error={errors.password?.message}
            {...register("password", {
              required: "You should enter password",
            })}
          />
          <Button
            className="text-2xl py-2 h-12"
            isLoading={isLoginIn}
            type="submit"
          >
            Log In
          </Button>
          <span>
            Don&apos;t have account?
            <a
              href="/registration"
              className="ml-1 text-blue-300 underline hover:text-yellow-400"
            >
              Create one!
            </a>
          </span>
        </form>
      </div>
    </div>
  );
}
