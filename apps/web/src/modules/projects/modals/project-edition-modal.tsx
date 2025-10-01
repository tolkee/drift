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

function ProjectEditionModal(props: {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();

  if (isMobile) return <Drawer {...props} shouldScaleBackground />;

  return <Dialog {...props} />;
}

function ProjectEditionModalTrigger(props: { children?: React.ReactNode }) {
  const isMobile = useIsMobile();
  if (isMobile) return <DrawerTrigger {...props} asChild />;
  return <DialogTrigger {...props} asChild />;
}

function ProjectEditionModalContent(props: {
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
      className={cn(
        "flex gap-10 items-center md:flex-col-reverse lg:flex-row md:max-w-[600px] ",
        props.className,
      )}
    />
  );
}

function ProjectEditionModalForm<TFormSchema extends FieldValues>({
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
        className={cn("flex-1", className)}
      >
        {children}
      </form>
    </Form>
  );
}

function ProjectEditionModalHeader(props: {
  children?: React.ReactNode;
  className?: string;
}) {
  const isMobile = useIsMobile();
  if (isMobile) return <DrawerHeader {...props} />;
  return <DialogHeader {...props} />;
}

function ProjectEditionModalTitle(props: {
  children?: React.ReactNode;
  className?: string;
}) {
  const isMobile = useIsMobile();
  if (isMobile) return <DrawerTitle {...props} />;
  return <DialogTitle {...props} />;
}

function ProjectEditionModalDescription(props: {
  children?: React.ReactNode;
  className?: string;
}) {
  const isMobile = useIsMobile();
  if (isMobile) return <DrawerDescription {...props} />;
  return <DialogDescription {...props} />;
}

function ProjectEditionModalFormFields({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn("space-y-8 p-4 md:p-0 2xl:mt-6", className)}
      {...props}
    />
  );
}

function ProjectEditionModalFooter(props: {
  children?: React.ReactNode;
  className?: string;
}) {
  const isMobile = useIsMobile();
  if (isMobile) return <DrawerFooter {...props} />;
  return (
    <DialogFooter
      {...props}
      className={cn("flex-row-reverse justify-start md:mt-6", props.className)}
    />
  );
}

function ProjectEditionModalClose(props: {
  children?: React.ReactNode;
  className?: string;
}) {
  const isMobile = useIsMobile();
  if (isMobile) return <DrawerClose {...props} asChild />;
  return <DialogClose {...props} asChild />;
}

function ProjectEditionModalPreview({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "p-8 bg-muted w-full flex justify-center items-center md:rounded-lg my-4 md:mx-auto md:my-8 md:max-w-md 2xl:hidden",
        className,
      )}
    />
  );
}

function ProjectEditionModalPreviewForBigScreen({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "w-full justify-center items-center hidden 2xl:flex bg-muted rounded-lg p-8",
        className,
      )}
      {...props}
    />
  );
}

export {
  ProjectEditionModalPreview,
  ProjectEditionModalPreviewForBigScreen,
  ProjectEditionModalFormFields,
  ProjectEditionModal,
  ProjectEditionModalTrigger,
  ProjectEditionModalContent,
  ProjectEditionModalHeader,
  ProjectEditionModalTitle,
  ProjectEditionModalDescription,
  ProjectEditionModalFooter,
  ProjectEditionModalClose,
  ProjectEditionModalForm,
};
