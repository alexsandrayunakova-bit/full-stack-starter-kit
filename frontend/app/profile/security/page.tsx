"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/Toast";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import api from "@/lib/api";

export default function SecuritySettings() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState<string | null>(null);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"email" | "google_authenticator">("email");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [step, setStep] = useState<"choose" | "verify" | "complete">("choose");

  useEffect(() => {
    fetchTwoFactorStatus();
  }, []);

  const fetchTwoFactorStatus = async () => {
    const response = await api.get<{ enabled: boolean; method: string | null }>("/api/2fa/status");
    if (response.data) {
      setTwoFactorEnabled(response.data.enabled);
      setTwoFactorMethod(response.data.method);
    }
  };

  const handleEnable2FA = async () => {
    if (!password) {
      showToast("Please enter your password", "error");
      return;
    }

    setLoading(true);
    const response = await api.post<any>("/api/2fa/enable", {
      method: selectedMethod,
      password: password
    });

    if (response.data) {
      if (selectedMethod === "google_authenticator") {
        setQrCodeUrl(response.data.qr_code_url);
        setSecret(response.data.secret);
      }
      setStep("verify");
      showToast(response.data.message, "success");
    } else {
      showToast(response.error || "Failed to enable 2FA", "error");
    }

    setLoading(false);
  };

  const handleVerify2FA = async () => {
    if (!verificationCode) {
      showToast("Please enter the verification code", "error");
      return;
    }

    setLoading(true);
    const response = await api.post<any>("/api/2fa/verify", {
      method: selectedMethod,
      code: verificationCode
    });

    if (response.data) {
      setRecoveryCodes(response.data.recovery_codes || []);
      setStep("complete");
      setTwoFactorEnabled(true);
      setTwoFactorMethod(selectedMethod);
      showToast(response.data.message, "success");
    } else {
      showToast(response.error || "Invalid verification code", "error");
    }

    setLoading(false);
  };

  const handleDisable2FA = async () => {
    if (!password) {
      showToast("Please enter your password to disable 2FA", "error");
      return;
    }

    if (!confirm("Are you sure you want to disable two-factor authentication?")) {
      return;
    }

    setLoading(true);
    const response = await api.post<any>("/api/2fa/disable", { password });

    if (response.data) {
      setTwoFactorEnabled(false);
      setTwoFactorMethod(null);
      setPassword("");
      showToast(response.data.message, "success");
    } else {
      showToast(response.error || "Failed to disable 2FA", "error");
    }

    setLoading(false);
  };

  const resetSetup = () => {
    setShowSetupModal(false);
    setPassword("");
    setVerificationCode("");
    setQrCodeUrl("");
    setSecret("");
    setRecoveryCodes([]);
    setStep("choose");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Security Settings</h1>

        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">Two-Factor Authentication (2FA)</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    2FA Status: {twoFactorEnabled ? (
                      <span className="text-green-600 dark:text-green-400">Enabled</span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400">Disabled</span>
                    )}
                  </p>
                  {twoFactorEnabled && twoFactorMethod && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Method: {twoFactorMethod === "email" ? "Email" : "Google Authenticator"}
                    </p>
                  )}
                </div>
                {!twoFactorEnabled ? (
                  <Button onClick={() => setShowSetupModal(true)}>Enable 2FA</Button>
                ) : (
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Enter password to disable"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mb-2"
                    />
                    <Button variant="danger" onClick={handleDisable2FA} disabled={loading}>
                      {loading ? "Disabling..." : "Disable 2FA"}
                    </Button>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  What is Two-Factor Authentication?
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Two-factor authentication adds an extra layer of security to your account. When enabled, you'll need to provide both your password and a verification code to log in.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Setup Modal */}
        {showSetupModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <h2 className="text-2xl font-bold">Enable Two-Factor Authentication</h2>
              </CardHeader>
              <CardBody>
                {step === "choose" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">Choose your 2FA method:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                          onClick={() => setSelectedMethod("email")}
                          className={`p-4 border-2 rounded-lg text-left transition-all ${
                            selectedMethod === "email"
                              ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                              : "border-gray-300 dark:border-gray-600 hover:border-primary-300"
                          }`}
                        >
                          <h4 className="font-semibold text-lg mb-2">Email</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Receive a verification code via email each time you log in
                          </p>
                        </button>

                        <button
                          onClick={() => setSelectedMethod("google_authenticator")}
                          className={`p-4 border-2 rounded-lg text-left transition-all ${
                            selectedMethod === "google_authenticator"
                              ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                              : "border-gray-300 dark:border-gray-600 hover:border-primary-300"
                          }`}
                        >
                          <h4 className="font-semibold text-lg mb-2">Google Authenticator</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Use an authenticator app to generate time-based codes
                          </p>
                        </button>
                      </div>
                    </div>

                    <div>
                      <Input
                        type="password"
                        label="Confirm your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        fullWidth
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button variant="secondary" onClick={resetSetup} fullWidth>
                        Cancel
                      </Button>
                      <Button onClick={handleEnable2FA} disabled={loading || !password} fullWidth>
                        {loading ? "Setting up..." : "Continue"}
                      </Button>
                    </div>
                  </div>
                )}

                {step === "verify" && (
                  <div className="space-y-6">
                    {selectedMethod === "google_authenticator" && qrCodeUrl && (
                      <div className="text-center space-y-4">
                        <h3 className="font-semibold">Scan this QR code with your authenticator app:</h3>
                        <div className="flex justify-center">
                          <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64 border-2 border-gray-300 rounded-lg" />
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Or enter this code manually:
                          </p>
                          <code className="text-sm font-mono">{secret}</code>
                        </div>
                      </div>
                    )}

                    {selectedMethod === "email" && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          A verification code has been sent to your email. Please check your inbox and enter the code below.
                        </p>
                      </div>
                    )}

                    <Input
                      type="text"
                      label="Enter verification code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      maxLength={6}
                      required
                      fullWidth
                      className="text-center text-2xl tracking-widest"
                    />

                    <div className="flex gap-3">
                      <Button variant="secondary" onClick={resetSetup} fullWidth>
                        Cancel
                      </Button>
                      <Button onClick={handleVerify2FA} disabled={loading || !verificationCode} fullWidth>
                        {loading ? "Verifying..." : "Verify & Enable"}
                      </Button>
                    </div>
                  </div>
                )}

                {step === "complete" && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-2">
                        2FA Enabled Successfully!
                      </h3>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                        Save your recovery codes
                      </h4>
                      <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
                        These codes can be used to access your account if you lose access to your 2FA method. Store them in a safe place.
                      </p>
                      <div className="bg-white dark:bg-gray-800 rounded p-3 font-mono text-sm grid grid-cols-2 gap-2">
                        {recoveryCodes.map((code, index) => (
                          <div key={index} className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
                            {code}
                          </div>
                        ))}
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="mt-3"
                        onClick={() => {
                          navigator.clipboard.writeText(recoveryCodes.join('\n'));
                          showToast('Recovery codes copied to clipboard', 'success');
                        }}
                      >
                        Copy All Codes
                      </Button>
                    </div>

                    <Button onClick={resetSetup} fullWidth>
                      Done
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
