"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInWithMicrosoft, isLoading, isAuthenticated } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  // Check for error from callback
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง");
    }
  }, [searchParams]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleMicrosoftLogin = async () => {
    setError(null);
    try {
      await signInWithMicrosoft();
      // Note: This will redirect to Microsoft, then back to /auth/callback
    } catch (err) {
      console.error("Login failed:", err);
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center space-y-6 pb-2">
        {/* ICPL Logo */}
        <div className="mx-auto">
          <Image
            src="https://i.ibb.co/4wdW4yvd/ICP-ladda-logo-01-Copy.png"
            alt="ICPL Logo"
            width={180}
            height={60}
            className="h-14 w-auto"
            unoptimized
          />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold text-primary">
            ICPL × BI Report
          </CardTitle>
          <CardDescription className="mt-2">
            ระบบแสดงผล Power BI Reports สำหรับองค์กร
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          className="w-full h-12 text-base"
          onClick={handleMicrosoftLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              กำลังเข้าสู่ระบบ...
            </>
          ) : (
            <>
              <svg
                className="mr-2 h-5 w-5"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
              </svg>
              เข้าสู่ระบบด้วย Microsoft
            </>
          )}
        </Button>

        <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
          <Shield className="h-4 w-4" />
          <span>เข้าสู่ระบบอย่างปลอดภัยด้วย Azure AD</span>
        </div>

        <div className="border-t pt-4">
          <p className="text-xs text-center text-muted-foreground">
            ใช้ Microsoft Account ขององค์กรในการเข้าสู่ระบบ
            <br />
            หากมีปัญหาในการเข้าสู่ระบบ กรุณาติดต่อฝ่าย IT
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function LoginFallback() {
  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center space-y-6 pb-2">
        <div className="mx-auto h-14 w-[180px] bg-muted animate-pulse rounded-lg" />
        <div>
          <div className="h-8 bg-muted animate-pulse rounded-lg w-48 mx-auto" />
          <div className="h-4 bg-muted animate-pulse rounded-lg w-64 mx-auto mt-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-12 bg-muted animate-pulse rounded-lg" />
        <div className="h-4 bg-muted animate-pulse rounded-lg w-48 mx-auto" />
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(var(--color-primary-50))] to-[hsl(var(--color-primary-100))] p-4">
      <Suspense fallback={<LoginFallback />}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
