import {
  Box,
  Button,
  Divider,
  Group,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, UseFormReturnType } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { loginWithEmailAndPassword, loginWithGoogle } from "../firebase/auth";
import { setUserEmail, setUserName } from "../firebase/firestore";
import {
  emailValidator,
} from "./validators/formValidators";

interface FormValues {
  email: string;
  password: string;
}

const initialValues: FormValues = {
  email: "",
  password: ""
};

const EmailInput = ({ form }: { form: UseFormReturnType<FormValues> }) => {
  return (
    <TextInput label="Email" {...form.getInputProps("email")} />
  );
};

const FirstPasswordInput = ({
  form,
}: {
  form: UseFormReturnType<FormValues>;
}) => {
  return (
    <PasswordInput
      label="Password"
      {...form.getInputProps("password")}
    />
  );
};

const onSubmit = async (values: FormValues) => {
  try {
    const user = await loginWithEmailAndPassword(values.email, values.password);
    showNotification({ message: "Successfully logged in!", color: "green" });
  } catch (e) {
    const error = e as Error;
    showNotification({ message: error.message, color: "red" });
  }
};

const handleGoogleLogin = async () => {
  try {
    const user = await loginWithGoogle();
    if (user) {
      if (user.email) setUserEmail(user, user.email);
    }
    showNotification({ message: "Successfully logged in!", color: "green" });
  } catch (e) {
    const error = e as Error;
    showNotification({ message: error.message });
  }
};

const LoginForm = () => {
  const form = useForm<FormValues>({
    initialValues: initialValues,
    validate: {
      email: emailValidator,
    },
  });

  return (
    <Box sx={{ maxWidth: 400, marginTop: 100 }} mx="auto">
      <Title>Login</Title>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <EmailInput form={form} />
        <FirstPasswordInput form={form} />

        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
      <Divider my="sm" label={(<Text size="md">or</Text>)} labelPosition="center" />
        <Button fullWidth variant="outline" onClick={handleGoogleLogin}>
          Sign in with Google
        </Button>
    </Box>
  );
};

export default LoginForm;
