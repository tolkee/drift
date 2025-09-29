import { api } from "@drift/backend/convex/api";
import type { Id } from "@drift/backend/convex/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalForm,
  ModalFormFields,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";

const formSchema = z.object({
  name: z.string().min(1),
});

export function CreateColumnModal({
  children,
  open,
  onOpenChange,
  rank,
  projectId,
}: {
  children?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  rank: number;
  projectId: Id<"projects">;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const createColumn = useMutation(api.projects.mutations.createColumn);

  const handleOpenChange = (open: boolean) => {
    onOpenChange?.(open);
    form.reset();
  };

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    await createColumn({ ...data, rank, projectId });
    handleOpenChange(false);
    toast.success(`Column "${data.name}" created successfully`);
  };

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      {children && <ModalTrigger>{children}</ModalTrigger>}
      <ModalContent>
        <ModalForm form={form} onSubmit={handleSubmit}>
          <ModalHeader>
            <ModalTitle>Create Column</ModalTitle>
            <ModalDescription>
              Create a new column to track your tasks.
            </ModalDescription>
          </ModalHeader>
          <ModalFormFields>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </ModalFormFields>
          <ModalFooter>
            <Button type="submit">Create</Button>
            <ModalClose>
              <Button variant="outline">Close</Button>
            </ModalClose>
          </ModalFooter>
        </ModalForm>
      </ModalContent>
    </Modal>
  );
}
