import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OtpVerifyDialogProps {
  open: boolean;
  onVerify: (otp: string) => void;
  onCancel: () => void;
  message: string;
}

export function OtpVerifyDialog({ open, onVerify, onCancel, message }: OtpVerifyDialogProps) {
  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    if (otp.length !== 6) return; // ensure full OTP
    onVerify(otp);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Email Verification</DialogTitle>
        </DialogHeader>
        <p>{message}</p>

        <div className="mt-4">
          <InputOTP value={otp} onChange={setOtp} maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <DialogFooter className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleVerify} disabled={otp.length !== 6}>Verify</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}