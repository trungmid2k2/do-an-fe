import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useFormik } from "formik";
import { getSession } from "next-auth/react";

interface Props {
  onClose: () => void;
  isOpen: boolean;
}
import { signIn } from "next-auth/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { BACKEND_URL } from "@/env";
export const ChangePasswordModal = ({ isOpen, onClose }: Props) => {
  const router = useRouter();
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const [show, setShow] = useState(false);

  const handleClick = () => setShow(!show);

  const formik = useFormik({
    initialValues: {
      old_password: "",
      password: "",
      confirm_password: "",
    },
    onSubmit: async (values) => {
      try {
        const session: any = await getSession(); // Get the session which includes the token
        if (!session || !session?.accessToken) {
          throw new Error("User not authenticated");
        }

        const res = await fetch(`${BACKEND_URL}/api/user/change_password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`, // Include the token in the Authorization header
          },
          body: JSON.stringify(values),
        });

        if (res.ok) {
          onClose();
        } else {
          // Handle error
          console.error("Failed to change password");
        }
      } catch (error) {
        console.error("Error");
      }
    },
  });

  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        size={"sm"}
      >
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={formik.handleSubmit}>
            <ModalHeader>Đổi mật khẩu</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Mật khẩu cũ</FormLabel>
                <InputGroup>
                  <Input
                    id="old_password"
                    name="old_password"
                    type={show ? "text" : "password"}
                    onChange={formik.handleChange}
                    value={formik.values.old_password}
                    placeholder="Mật khẩu cũ"
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                      {show ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Mật khẩu mới</FormLabel>
                <InputGroup>
                  <Input
                    id="password"
                    name="password"
                    type={show ? "text" : "password"}
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    placeholder="Mật khẩu mới"
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                      {show ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Xác nhận mật khẩu</FormLabel>
                <InputGroup>
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type={show ? "text" : "password"}
                    onChange={formik.handleChange}
                    value={formik.values.confirm_password}
                    placeholder="Xác nhận mật khẩu"
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                      {show ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button type="submit" colorScheme="blue" mr={3}>
                Đổi
              </Button>
              <Button onClick={onClose}>Hủy</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
