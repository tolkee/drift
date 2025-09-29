import type { ComponentProps } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Form } from "@/components/ui/form";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

function Modal(props: {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();

  if (isMobile) return <Drawer {...props} shouldScaleBackground />;

  return <Dialog {...props} />;
}

function ModalTrigger(props: { children?: React.ReactNode }) {
  const isMobile = useIsMobile();
  if (isMobile) return <DrawerTrigger {...props} asChild />;
  return <DialogTrigger {...props} asChild />;
}

function ModalContent(props: {
  children?: React.ReactNode;
  className?: string;
}) {
  const isMobile = useIsMobile();
  if (isMobile)
    return (
      <DrawerContent
        {...props}
        className={cn("min-h-[96vh] flex flex-col w-full", props.className)}
      />
    );
  return (
    <DialogContent
      {...props}
      className={cn("flex gap-10 items-center flex-col", props.className)}
    />
  );
}

function ModalForm<TFormSchema extends FieldValues>({
  children,
  form,
  onSubmit,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
  form: UseFormReturn<TFormSchema>;
  onSubmit: (data: TFormSchema) => void;
}) {
  const isMobile = useIsMobile();

  if (isMobile)
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("flex-grow flex flex-col", className)}
        >
          {children}
        </form>
      </Form>
    );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex-1 w-full", className)}
      >
        {children}
      </form>
    </Form>
  );
}

function ModalHeader(props: {
  children?: React.ReactNode;
  className?: string;
}) {
  const isMobile = useIsMobile();
  if (isMobile) return <DrawerHeader {...props} />;
  return <DialogHeader {...props} />;
}

function ModalTitle(props: { children?: React.ReactNode; className?: string }) {
  const isMobile = useIsMobile();
  if (isMobile) return <DrawerTitle {...props} />;
  return <DialogTitle {...props} />;
}

function ModalDescription(props: {
  children?: React.ReactNode;
  className?: string;
}) {
  const isMobile = useIsMobile();
  if (isMobile) return <DrawerDescription {...props} />;
  return <DialogDescription {...props} />;
}

function ModalFormFields({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("space-y-8 p-4 md:p-0 2xl:mt-6", className)}
      {...props}
    />
  );
}

function ModalFooter(props: {
  children?: React.ReactNode;
  className?: string;
}) {
  const isMobile = useIsMobile();
  if (isMobile) return <DrawerFooter {...props} />;
  return (
    <DialogFooter
      {...props}
      className={cn("flex-row-reverse justify-start mt-6", props.className)}
    />
  );
}

function ModalClose(props: { children?: React.ReactNode; className?: string }) {
  const isMobile = useIsMobile();
  if (isMobile) return <DrawerClose {...props} asChild />;
  return <DialogClose {...props} asChild />;
}

export {
  ModalFormFields,
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
  ModalForm,
};
