import { convexQuery } from "@convex-dev/react-query";
import { api } from "@drift/backend/convex/api";
import type { DataModel } from "@drift/backend/convex/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "convex/react";
import { useForm, useWatch } from "react-hook-form";
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
import { ProjectCardPreview } from "../components/project-card";
import {
  ProjectEditionModal,
  ProjectEditionModalClose,
  ProjectEditionModalContent,
  ProjectEditionModalDescription,
  ProjectEditionModalFooter,
  ProjectEditionModalForm,
  ProjectEditionModalFormFields,
  ProjectEditionModalHeader,
  ProjectEditionModalPreview,
  ProjectEditionModalPreviewForBigScreen,
  ProjectEditionModalTitle,
  ProjectEditionModalTrigger,
} from "./project-edition-modal";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string()),
});

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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: project.name,
      description: project.description,
      tags: project.tags,
    },
  });
  const formValues = useWatch({
    control: form.control,
  });

  const { data: projectTagsRef, isLoading: isProjectTagsRefLoading } = useQuery(
    convexQuery(api.projects.queries.getProjectTagsRef, {}),
  );
  const addProjectTagRef = useMutation(api.projects.mutations.addProjectTagRef);
  const updateProject = useMutation(api.projects.mutations.updateProject);

  const handleOpenChange = (open: boolean) => {
    onOpenChange?.(open);
  };

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    await updateProject({
      projectId: project._id,
      patch: data,
    });
    handleOpenChange(false);
    toast.success(`Project "${data.name}" updated successfully`);
  };

  return (
    <ProjectEditionModal open={open} onOpenChange={handleOpenChange}>
      {children && (
        <ProjectEditionModalTrigger>{children}</ProjectEditionModalTrigger>
      )}
      <ProjectEditionModalContent>
        <ProjectEditionModalForm form={form} onSubmit={handleSubmit}>
          <ProjectEditionModalHeader>
            <ProjectEditionModalTitle>Edit Project</ProjectEditionModalTitle>
            <ProjectEditionModalDescription>
              Edit your project information.
            </ProjectEditionModalDescription>
          </ProjectEditionModalHeader>
          <ProjectEditionModalPreview>
            <ProjectCardPreview project={formValues} />
          </ProjectEditionModalPreview>
          <ProjectEditionModalFormFields>
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
          </ProjectEditionModalFormFields>
          <ProjectEditionModalFooter>
            <Button type="submit" disabled={!form.formState.isValid}>
              Save
            </Button>
            <ProjectEditionModalClose>
              <Button variant="outline">Close</Button>
            </ProjectEditionModalClose>
          </ProjectEditionModalFooter>
        </ProjectEditionModalForm>
        <ProjectEditionModalPreviewForBigScreen>
          <ProjectCardPreview project={formValues} />
        </ProjectEditionModalPreviewForBigScreen>
      </ProjectEditionModalContent>
    </ProjectEditionModal>
  );
}
