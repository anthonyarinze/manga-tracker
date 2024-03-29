import Form from "../ui/Form";
import SpinnerMini from "../ui/SpinnerMini";
import { useSignup } from "../hooks/useSignup";
import { useForm } from "react-hook-form";
import FormRow from "../ui/FormRow";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Heading from "../ui/Heading";
import styled from "styled-components";

const StyledDiv = styled.div`
  display: flex;
  margin-top: 50px;
  justify-self: start;
`;

function Signup() {
  const { signUp, isLoading } = useSignup();
  const { register, formState, getValues, handleSubmit, reset } = useForm();
  const { errors } = formState;

  function onSubmit({ fullName, email, password }) {
    signUp(
      {
        fullName,
        email,
        password,
      },
      {
        onSettled: () => {
          reset();
        },
      }
    );
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Heading as="h2">
        Sign up for Manga Pulse to keep track of your favorites.
      </Heading>
      <FormRow label="Full name" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          disabled={isLoading}
          {...register("fullName", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Email address" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isLoading}
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please provide a valid email.",
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Password (min 8 characters)"
        error={errors?.password?.message}
      >
        <Input
          type="password"
          id="password"
          disabled={isLoading}
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password needs a minimum of 8 characters",
            },
          })}
        />
      </FormRow>

      <FormRow label="Repeat password" error={errors?.passwordConfirm?.message}>
        <Input
          type="password"
          id="passwordConfirm"
          disabled={isLoading}
          {...register("passwordConfirm", {
            required: "This field is required",
            validate: (value) =>
              value === getValues().password || "Passwords need to match.",
          })}
        />
      </FormRow>

      <StyledDiv>
        <FormRow>
          {/* type is an HTML attribute! */}
          <Button
            variation="secondary"
            type="reset"
            disabled={isLoading}
            onClick={reset}
          >
            Cancel
          </Button>
          <Button disabled={isLoading}>
            {isLoading ? <SpinnerMini /> : "Create Account"}
          </Button>
        </FormRow>
      </StyledDiv>
    </Form>
  );
}

export default Signup;
