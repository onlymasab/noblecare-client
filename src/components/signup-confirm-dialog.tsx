import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SignUpConfirmDialogProps {
  open: boolean;
  onConfirm: (name: string) => void;
  onCancel: () => void;
  message: string;
}

export function SignUpConfirmDialog({ open, onConfirm, onCancel, message }: SignUpConfirmDialogProps) {
  const [name, setName] = useState("");

  const handleConfirm = () => {
    if (!name.trim()) return; // optionally validate name
    onConfirm(name.trim());
  };

  return (
    <Dialog open={open} onOpenChange={val => !val && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Sign Up</DialogTitle>
        </DialogHeader>
        <p>{message}</p>

        <div className="mt-4">
          <Label htmlFor="name">Your Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>

        <DialogFooter className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={!name.trim()}>Sign Up</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}