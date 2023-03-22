import { type ReactEventHandler, useCallback } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { v4 } from "uuid";

import { trpcReact } from "../api";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useMessageBus } from "../hooks";
import { TRPCWrapper } from "./TRPCWrapper";

type RegistrationForm = {
  username: string;
  password: string;
  repeatPassword: string;
};

function Registration() {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationForm>({
    defaultValues: {
      username: "",
      password: "",
      repeatPassword: "",
    },
  });
  const createUser = trpcReact.auth.signUp.useMutation();
  const { pushMessage } = useMessageBus();

  const signUpUser: SubmitHandler<RegistrationForm> = useCallback((data) => {
    createUser
      .mutateAsync(data)
      .then((message) => {
        pushMessage(message);
        return fetch("/api/login", {
          method: "POST",
          body: JSON.stringify({
            username: data.username,
            password: data.password,
          }),
        });
      })
      .then((signInResponse) => {
        if (signInResponse?.ok) {
          pushMessage({
            id: v4(),
            state: "Success",
            message: "You successfully signed in",
          });
          signInResponse.json().then(({ access_token }) => {
            localStorage.setItem("poke_deck_astro_token", access_token);
            location.assign("/home");
          });
        } else {
          pushMessage({
            id: v4(),
            state: "Failure",
            message: "Couldn't sign you in",
          });
        }
      })
      .catch(pushMessage);
  }, []);

  const onSubmit = useCallback<ReactEventHandler>(
    (event) =>
      handleSubmit(signUpUser)(event).catch((error) => {
        console.log(error);
      }),
    [],
  );

  return (
    <div className="flex w-full items-center justify-center font-fredoka relative">
      <form
        className="flex flex-col gap-5 sm:rounded-lg text-xl bg-purple-900 p-5 
            sm:shadow-[0px_0px_20px_5px] sm:shadow-zinc-600/50 w-full max-w-2xl
            rounded-none shadow-none"
        onSubmit={onSubmit}
      >
        <Input
          id="username"
          label="Username:"
          labelStyles="text-2xl"
          inputStyles="text-2xl h-14"
          errorStyles="text-lg"
          error={errors?.username?.message}
          {...register("username", {
            required: "You should specify username",
            minLength: {
              value: 3,
              message: "Username should be longer than 3 symbols",
            },
            maxLength: {
              value: 30,
              message: "Username is too long...",
            },
          })}
        />
        <Input
          id="password"
          type="password"
          label="Password:"
          labelStyles="text-2xl"
          inputStyles="text-2xl h-14"
          errorStyles="text-lg"
          error={errors?.password?.message}
          {...register("password", {
            required: "You should specify password",
            minLength: {
              value: 8,
              message: "Password should be longer than 8 symbols",
            },
            pattern: {
              value: /[\w(@|#|$|&)+]{8,}/,
              message:
                "Your password should contain at least one of this @, #, $, &",
            },
          })}
        />
        <Input
          id="repeatPassword"
          type="password"
          label="Repeat Password:"
          labelStyles="text-2xl"
          inputStyles="text-2xl h-14"
          errorStyles="text-lg"
          error={errors?.repeatPassword?.message}
          {...register("repeatPassword", {
            required: "You should put password",
            validate: (value) =>
              value === getValues("password") ||
              "You should repeat your 'password'",
          })}
        />
        <Button
          className="text-2xl h-12"
          type="submit"
          isLoading={createUser.isLoading || createUser.isSuccess}
        >
          Register
        </Button>
        <span>
          Already have account?
          <a
            href="/login"
            className="ml-1 text-blue-300 underline hover:text-yellow-400"
          >
            Log in!
          </a>
        </span>
      </form>
    </div>
  );
}

export const TRPCRegistration = TRPCWrapper(Registration);
