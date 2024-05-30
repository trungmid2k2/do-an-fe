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
import { ResetPassword } from "./ResetPassword";

interface Props {
  onClose: () => void;
  isOpen: boolean;
}

export const SendEmailForgot = ({ isOpen, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dataForgotPassword, setDataForgotPassword] = useState<
    ForgotPassword | undefined
  >(undefined);
  const toast = useToast();
  const [showTypePassword, setShowTypePassword] = useState(false);
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/forgot_password`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        const data = await res.json();
        const takeData = data.data;
        setDataForgotPassword(takeData);
        if (res.ok) {
          toast({
            title: "Thành công!",
            description: "Chúng tôi đã gửi gmail đặt lại mật khẩu cho bạn",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
          setIsLoading(false);
          onClose();
          setShowTypePassword(true);
          // console.log("res", res.data);
        } else {
          toast({
            title: "Có lỗi xảy ra.",
            description: "Hãy kiểm tra lại thông tin.",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
          setShowTypePassword(false);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error");
        setIsLoading(false);
        setShowTypePassword(false);
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
            <ModalHeader>Tạo lại mật khẩu</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Gmail</FormLabel>
                <Input
                  id="email"
                  name="email"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  required
                  placeholder="Gmail mà bạn dùng để tạo tài khoản"
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                isLoading={isLoading}
                loadingText="Đang xử lý"
                type="submit"
                colorScheme="blue"
                mr={3}
              >
                Gửi
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
      <ResetPassword
        show={showTypePassword}
        token={dataForgotPassword?.token}
      />
    </>
  );
};
