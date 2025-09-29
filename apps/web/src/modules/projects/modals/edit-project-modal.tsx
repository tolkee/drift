import { convexQuery } from "@convex-dev/react-query";
import { api } from "@drift/backend/convex/api";
import type { DataModel } from "@drift/backend/convex/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "convex/react";
import { type UseFormReturn, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { TagsCreatableCombobox } from "@/components/tags-creatable-combobox";
import { Button } from "@/components/ui/button";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string()),
});

function ModalFormFields({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) {
  const { data: projectTagsRef, isLoading: isProjectTagsRefLoading } = useQuery(
    convexQuery(api.projects.queries.getProjectTagsRef, {}),
  );
  const addProjectTagRef = useMutation(api.projects.mutations.addProjectTagRef);

  return (
    <>
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
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <FormControl>
              <TagsCreatableCombobox
                loading={isProjectTagsRefLoading}
                availableTags={projectTagsRef}
                values={field.value}
                onChange={(values) => {
                  field.onChange(values);
                }}
                onAddTag={(value, color) => {
                  addProjectTagRef({ name: value, color });
                }}
              />
            </FormControl>
            <FormDescription>
              Add tags to your project to better describe it.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

const MODAL_TITLE = "Edit Project";
const MODAL_DESCRIPTION = "Edit your project information.";

export function EditProjectModal({
  project,
  children,
  open,
  onOpenChange,
}: {
  project: DataModel["projects"]["document"];
  children?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: project.name,
      description: project.description,
      tags: project.tags,
    },
  });

  const updateProject = useMutation(api.projects.mutations.updateProject);

  const handleOpenChange = (open: boolean) => {
    onOpenChange?.(open);
  };

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    await updateProject({
      id: project._id,
      patch: data,
    });
    handleOpenChange(false);
    toast.success(`Project "${data.name}" updated successfully`);
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        {children && <DrawerTrigger>{children}</DrawerTrigger>}
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{MODAL_TITLE}</DrawerTitle>
            <DrawerDescription>{MODAL_DESCRIPTION}</DrawerDescription>
          </DrawerHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="p-4 space-y-8">
                <ModalFormFields form={form} />
              </div>
              <DrawerFooter>
                <Button type="submit">Save</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </Form>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[700px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <DialogHeader>
              <DialogTitle>{MODAL_TITLE}</DialogTitle>
              <DialogDescription>{MODAL_DESCRIPTION}</DialogDescription>
            </DialogHeader>
            <ModalFormFields form={form} />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
