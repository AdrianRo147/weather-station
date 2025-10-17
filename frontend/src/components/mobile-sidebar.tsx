import { useState } from "react";
import { Button, Drawer, DrawerBody, DrawerContent } from "@heroui/react";
import { Menu } from "lucide-react";
import { Sidebar } from "./sidebar";

export const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="flex h-14 w-full fixed left-0 right-0 items-center border-b border-divider px-4 bg-content1 z-99">
        <Button
          isIconOnly
          variant="light"
          onPress={handleOpen}
          aria-label="Open menu"
        >
          <Menu width={24} height={24} />
        </Button>
      </div>

      <Drawer isOpen={isOpen} onClose={handleClose} placement="left" className="w-64 dark">
        <DrawerContent className="bg-content1">
          <DrawerBody className="p-0 mt-14">
            <Sidebar />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
