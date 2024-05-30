import { SendEmailForgot } from "@/components/resetPassword/SendEmailForgot";
import { Button, Flex } from "@chakra-ui/react";

import React, { useState } from "react";

type Props = {};

export default function Index({}: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const onClose = () => setIsOpen(false);

  return (
    <>
      <SendEmailForgot isOpen={isOpen} onClose={onClose} />
      <Flex align={"center"} justify={"center"} mt={200}>
        <Button onClick={() => setIsOpen(true)}>
          Gửi yêu cầu đặt lại mật khẩu
        </Button>
      </Flex>
    </>
  );
}
