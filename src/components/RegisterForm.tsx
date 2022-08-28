import { Box, Button, Divider, FileInput, Group, PasswordInput, Text, TextInput, Title } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm, UseFormReturnType } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { loginWithGoogle, registerWithEmailAndPassword } from "../firebase/auth";
import { setUserEmail, setUserName } from "../firebase/firestore";
import { emailValidator, passwordValidator, confirmPasswordValidator } from './validators/formValidators';


interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  // dateOfBirth: Date;
  // photoBlob: Blob;
}

const initialValues: FormValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // dateOfBirth: new Date(),
    // photoBlob: new Blob()
}

const NameInput = ({ form }: { form: UseFormReturnType<FormValues> }) => {
  return <TextInput required withAsterisk label="Name" {...form.getInputProps("name")} />;
}

const EmailInput = ({ form }: { form: UseFormReturnType<FormValues> }) => {
  return <TextInput required withAsterisk label="Email" {...form.getInputProps("email")} />;
};

const FirstPasswordInput = ({ form }: { form: UseFormReturnType<FormValues> }) => {
  return <PasswordInput withAsterisk label="Password" {...form.getInputProps("password")}
    description={`Password must at least be 8 characters long and have at least 1 special character`} />;
};

const ConfirmPasswordInput = ({ form }: { form: UseFormReturnType<FormValues> }) => {
  return <PasswordInput withAsterisk label="Confirm password" {...form.getInputProps("confirmPassword")} />;
};

// const DOBInput = ({ form }: { form: UseFormReturnType<FormValues> }) => {
//   return <DatePicker required withAsterisk label="Date of birth" {...form.getInputProps("dateOfBirth")} />;
// };

// const PhotoBlobInput = ({ form }: { form: UseFormReturnType<FormValues> }) => {
//   return <FileInput required withAsterisk label="Upload photo" {...form.getInputProps("photoBlob")} />;
// };

const onSubmit = async (values: FormValues) => {
  try {
    const user = await registerWithEmailAndPassword(values.email, values.password);
    if (user) {
      if (user.email) setUserEmail(user, user.email);
      if (user.displayName) setUserName(user, user.displayName);
    }
    showNotification({ message: "Successfully registered!", color: "green" });
  } catch(e) {
    const error = e as Error;
    showNotification({ message: error.message });
  }
};

const handleGoogleLogin = async () => {
  try {
    const user = await loginWithGoogle();
    if (user) {
      if (user.email) setUserEmail(user, user.email);
      if (user.displayName) setUserName(user, user.displayName);
    }
    showNotification({ message: "Successfully logged in!", color: "green" });
  } catch(e) {
    const error = e as Error;
    showNotification({ message: error.message });
  }
};

const RegisterForm = () => {
    const form = useForm<FormValues>({
        initialValues: initialValues,
        validate: {
            email: emailValidator,
            password: passwordValidator,
            confirmPassword: confirmPasswordValidator
        },
    });

    return (
      <Box sx={{ maxWidth: 400, marginTop: 100 }} mx="auto">
        <Title>Register</Title>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <NameInput form={form} />
          <EmailInput form={form} />
          <FirstPasswordInput form={form} />
          <ConfirmPasswordInput form={form} />

          <Group position="right" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
        
        <Divider my="sm" label={<Text size="md">or</Text>} labelPosition="center" />
        <Button fullWidth variant="outline" onClick={handleGoogleLogin}>
          Sign in with Google
        </Button>
      </Box>
    );
}

export default RegisterForm;