import { api } from "@drift/backend/convex/api";
import type { DataModel } from "@drift/backend/convex/dataModel";
import { IconExclamationCircleFilled } from "@tabler/icons-react";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

type DeleteProjectModalProps = {
  project: DataModel["projects"]["document"];
  children?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function DeleteProjectModal({
  project,
  children,
  open,
  onOpenChange,
}: DeleteProjectModalProps) {
  const isMobile = useIsMobile();
  const [nameAck, setNameAck] = useState<string>("");

  const deleteProject = useMutation(api.projects.mutations.deleteProject);

  const handleOpenChange = (open: boolean) => {
    onOpenChange?.(open);
    setNameAck("");
  };

  const handleSubmit = async () => {
    if (!isNameAckCorrect) return;

    await deleteProject({ projectId: project._id });
    handleOpenChange(false);
    toast.success(`Project "${project.name}" deleted successfully`);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const isNameAckCorrect = nameAck === project.name;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        {children && <DrawerTrigger>{children}</DrawerTrigger>}
        <DrawerContent onKeyUp={handleKeyUp}>
          <DrawerHeader>
            <IconExclamationCircleFilled className="h-10 w-10 mx-auto my-4" />
            <DrawerTitle>Delete Project</DrawerTitle>
            <DrawerDescription>
              You are about to delete the project "{project.name}". Please type
              the project name to confirm.
            </DrawerDescription>
          </DrawerHeader>
          <div className="mx-4 my-4">
            <Input
              value={nameAck}
              placeholder="Enter project name"
              onChange={(e) => setNameAck(e.target.value)}
            />
          </div>

          <DrawerFooter>
            <Button
              type="submit"
              variant="destructive"
              disabled={!isNameAckCorrect}
              onClick={handleSubmit}
            >
              Delete Project
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent onKeyUp={handleKeyUp}>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          You are about to delete the project{" "}
          <span className="font-bold text-primary">"{project.name}"</span>.
          Please type the project name to confirm.
        </DialogDescription>
        <Input
          autoFocus
          value={nameAck}
          placeholder="Enter project name"
          onChange={(e) => setNameAck(e.target.value)}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            variant="destructive"
            disabled={!isNameAckCorrect}
            onClick={handleSubmit}
          >
            Delete Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
