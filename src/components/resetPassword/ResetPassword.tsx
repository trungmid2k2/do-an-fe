import {
  Button,
  Container,
  FormControl,
  FormLabel,
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
  useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useFormik } from "formik";
import { BACKEND_URL } from "@/env";
import { useRouter } from "next/router";
import usePasswordResetStore from "@/store/passwordReset";

export const ResetPassword = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const passwordResetData = usePasswordResetStore(
    (state: any) => state.passwordResetData
  );

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/reset_password/${passwordResetData.token}`,
          {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );
        if (res.ok) {
          toast({
            title: "Thành công!",
            description:
              "Đặt lại mật khẩu thành công. Bạn có thể đăng nhập bằng mật khẩu mới của mình.",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
          setIsLoading(false);
          router.push("/");
        } else {
          toast({
            title: "Có lỗi xảy ra.",
            description: "Hãy kiểm tra lại!",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error");
        setIsLoading(false);
      }
    },
  });

  return (
    <div>
      <Container mt={300}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel>Mật khẩu mới</FormLabel>
            <Input
              id="password"
              name="password"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.password}
              required
              placeholder="Mật khẩu mới mà bạn đặt lại"
            />
          </FormControl>

          <Button isLoading={isLoading} type="submit" colorScheme="blue" mt={3}>
            Gửi
          </Button>
        </form>
      </Container>
    </div>
  );
};
