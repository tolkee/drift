import { convexQuery } from "@convex-dev/react-query";
import { api } from "@drift/backend/convex/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { TagsCreatableCombobox } from "@/components/tags-creatable-combobox";
import { Button } from "@/components/ui/button";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ProjectEditionModal,
  ProjectEditionModalClose,
  ProjectEditionModalContent,
  ProjectEditionModalDescription,
  ProjectEditionModalFooter,
  ProjectEditionModalForm,
  ProjectEditionModalFormFields,
  ProjectEditionModalHeader,
  ProjectEditionModalTitle,
  ProjectEditionModalTrigger,
} from "./project-edition-modal";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string()),
});

export function CreateProjectModal({
  children,
  open,
  onOpenChange,
}: {
  children?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      tags: [],
    },
  });

  const { data: projectTagsRef, isLoading: isProjectTagsRefLoading } = useQuery(
    convexQuery(api.projects.queries.getProjectTagsRef, {}),
  );
  const addProjectTagRef = useMutation(api.projects.mutations.addProjectTagRef);

  const createProject = useMutation(api.projects.mutations.createProject);

  const handleOpenChange = (open: boolean) => {
    onOpenChange?.(open);
    form.reset();
  };

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    await createProject(data);
    handleOpenChange(false);
    toast.success(`Project "${data.name}" created successfully`);
  };

  return (
    <ProjectEditionModal open={open} onOpenChange={handleOpenChange}>
      {children && (
        <ProjectEditionModalTrigger>{children}</ProjectEditionModalTrigger>
      )}
      <ProjectEditionModalContent>
        <ProjectEditionModalForm form={form} onSubmit={handleSubmit}>
          <ProjectEditionModalHeader>
            <ProjectEditionModalTitle>Create Project</ProjectEditionModalTitle>
            <ProjectEditionModalDescription>
              Create a new project to track your goals and tasks.
            </ProjectEditionModalDescription>
          </ProjectEditionModalHeader>
          <ProjectEditionModalFormFields>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ProjectxXx" />
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
                    <Textarea
                      {...field}
                      className="h-40"
                      placeholder="Best project everrrrr..."
                    />
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
                      values={field.value}
                      availableTags={projectTagsRef}
                      onChange={(values) => {
                        console.log(values);
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
          </ProjectEditionModalFormFields>
          <ProjectEditionModalFooter>
            <Button type="submit" disabled={!form.formState.isValid}>
              Create
            </Button>
            <ProjectEditionModalClose>
              <Button variant="outline">Close</Button>
            </ProjectEditionModalClose>
          </ProjectEditionModalFooter>
        </ProjectEditionModalForm>
      </ProjectEditionModalContent>
    </ProjectEditionModal>
  );
}
