import {
  // Alert,
  // AlertIcon,
  // Box,
  Button,
  FormControl,
  FormLabel,
  // HStack,
  // Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  // Text,
  // VStack,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useFormik } from "formik";

interface Props {
  onClose: () => void;
  isOpen: boolean;
}
import { signIn } from "next-auth/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
export const LoginModal = ({ isOpen, onClose }: Props) => {
  const router = useRouter();
  const toast = useToast();
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const [show, setShow] = useState(false);

  const handleClick = () => setShow(!show);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        const res = await signIn("credentials", {
          ...values,
          callbackUrl: "/",
          redirect: true,
        });
        if (res?.error) {
          toast({
            title: "Có lỗi xảy ra.",
            description: "Hãy kiểm tra lại thông tin đăng nhập.",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
        } else {
          toast({
            title: "Đăng nhập thành công.",
            description: "",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
          onClose();
        }
      } catch (error) {
        toast({
          title: "Có lỗi xảy ra.",
          description: "Vui lòng thử lại sau",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
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
            <ModalHeader>Đăng nhập</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Tên đăng nhập</FormLabel>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  required
                  placeholder="Tên đăng nhập"
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Mật khẩu</FormLabel>
                <InputGroup>
                  <Input
                    id="password"
                    name="password"
                    type={show ? "text" : "password"}
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    placeholder="Mật khẩu"
                    required
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
                Đăng nhập
              </Button>
              <Button onClick={onClose}>Hủy</Button>
            </ModalFooter>
          </form>
        </ModalContent>
        {/* <ResetPassword isOpen={showForgotPassword} onClose={() => {}} /> */}
      </Modal>
    </>
  );
};
