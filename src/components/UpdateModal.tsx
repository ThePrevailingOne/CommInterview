import {
  Box,
  Button,
  FileInput,
  Group,
  Loader,
  Modal,
  Stack,
  TextInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import { User } from "firebase/auth";
import { useState } from "react";
import {
  setUserDOB,
  setUserName,
  setUserPhotoURL,
} from "../firebase/firestore";
import { uploadUserPhoto } from "../firebase/storage";

interface PropType {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | undefined | null;
}

interface InputPropType {
  user: User | undefined | null;
}

const wrapWithNotification = async (promise: Promise<void>) => {
  try {
    await promise;
    showNotification({
      message: "Successfully updated!",
      color: "green",
    });
  } catch {
    showNotification({
      message: "Fail to update",
      color: "red",
    });
  }
};

const NameInput = ({ user }: InputPropType) => {
  const [value, setValue] = useState("");
  const handle = () => wrapWithNotification(setUserName(user as User, value));
  return (
    <>
      <TextInput
        label="Name"
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
      />
      <Group position="right" onClick={handle}>
        <Button>Update</Button>
      </Group>
    </>
  );
};

const DOBInput = ({ user }: InputPropType) => {
  const [value, setValue] = useState(new Date());
  const handle = () => wrapWithNotification(setUserDOB(user as User, value));
  return (
    <>
      <DatePicker
        label="Date of birth"
        value={value}
        onChange={setValue as (value: Date | null) => void}
      />
      <Group position="right" onClick={handle}>
        <Button>Update</Button>
      </Group>
    </>
  );
};

const PhotoInput = ({ user }: InputPropType) => {
  const [value, setValue] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const handle = () => {
    setUploading(true);
    uploadUserPhoto(
      value ?? new File([], "unknown.jpg"),
      user as User,
      () => {},
      (error) => {console.log(error)},
      (photoURL) => {
        setUploading(true);
        showNotification({ message: "Upload successful!", color: "green"});
        wrapWithNotification(setUserPhotoURL(user as User, photoURL));
      }
    );
  };
  return (
    <>
      <FileInput
        label="Upload user photo"
        value={value}
        onChange={setValue}
        accept="image/png,image/jpeg,image/jpg"
      />
      <Group position="right" onClick={handle}>
        <Button>{uploading? (<Loader/>): "Upload"}</Button>
      </Group>
    </>
  );
};

const UpdateModal = ({ opened, setOpened, user }: PropType) => {
  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="Update your profile"
      size={600}
    >
      <Stack>
        <NameInput user={user} />
        <DOBInput user={user} />
        <PhotoInput user={user} />
      </Stack>
    </Modal>
  );
};

export default UpdateModal;
