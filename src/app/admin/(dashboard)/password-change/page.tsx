'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Save, Eye, EyeOff, Check, X, AlertCircle } from 'lucide-react';
import { changePassword } from '@/lib/actions/admin-auth';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface PasswordRequirement {
    id: string;
    label: string;
    met: boolean;
}

export default function PasswordChangePage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    });

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [requirements, setRequirements] = useState<PasswordRequirement[]>([
        { id: 'length', label: '8자 이상', met: false },
        { id: 'uppercase', label: '영문 대문자 포함', met: false },
        { id: 'lowercase', label: '영문 소문자 포함', met: false },
        { id: 'number', label: '숫자 포함', met: false },
        { id: 'special', label: '특수문자 포함 (@$!%*?&)', met: false },
    ]);

    const [isMatch, setIsMatch] = useState(false);

    // Real-time validation
    useEffect(() => {
        const pwd = formData.newPassword;

        setRequirements(prev => prev.map(req => {
            let met = false;
            switch (req.id) {
                case 'length': met = pwd.length >= 8; break;
                case 'uppercase': met = /[A-Z]/.test(pwd); break;
                case 'lowercase': met = /[a-z]/.test(pwd); break;
                case 'number': met = /\d/.test(pwd); break;
                case 'special': met = /[@$!%*?&]/.test(pwd); break; // Matches the regex used in validation
            }
            return { ...req, met };
        }));

        setIsMatch(pwd === formData.confirmPassword && pwd !== '');

    }, [formData.newPassword, formData.confirmPassword]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const isAllRequirementsMet = requirements.every(r => r.met);
    const canSubmit = isAllRequirementsMet && isMatch && !isLoading;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!canSubmit) return;

        setIsLoading(true);

        try {
            const result = await changePassword(formData.newPassword);

            if (result.success) {
                toast({
                    variant: "success",
                    title: "비밀번호 변경 완료",
                    description: "성공적으로 변경되었습니다. 홈으로 이동합니다.",
                });
                router.push('/admin/home');
                router.refresh();
            } else {
                toast({
                    variant: "destructive",
                    title: "변경 실패",
                    description: result.error || "비밀번호 변경 중 오류가 발생했습니다.",
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "오류 발생",
                description: "예기치 않은 오류가 발생했습니다.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-lg shadow-xl border-gray-100">
                <CardHeader className="space-y-4 text-center pt-10 pb-6 border-b border-gray-50 bg-white rounded-t-xl">

                    <div className="space-y-2">
                        <CardTitle className="text-2xl font-bold text-gray-900">
                            관리자 보안 설정
                        </CardTitle>
                        <CardDescription className="text-gray-500 text-base">
                            안전한 시스템 관리를 위해<br />새로운 비밀번호를 설정해주세요.
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="pt-8 space-y-6 bg-white rounded-b-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* New Password Field */}
                        <div className="space-y-3">
                            <Label htmlFor="newPassword" className="text-sm font-semibold text-gray-700">새 비밀번호</Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="새 비밀번호 입력"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className={cn(
                                        "pr-10 h-12 text-base transition-all",
                                        formData.newPassword && !isAllRequirementsMet ? "border-red-200 focus:ring-red-500/20" : "",
                                        isAllRequirementsMet ? "border-green-200 focus:ring-green-500/20 focus:border-green-500" : ""
                                    )}
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </Button>
                            </div>

                            {/* Requirements Checklist */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 p-4 bg-gray-50 rounded-lg">
                                {requirements.map((req) => (
                                    <div key={req.id} className="flex items-center gap-2 text-xs transition-colors duration-200">
                                        {req.met ? (
                                            <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                                        ) : (
                                            <div className="w-3.5 h-3.5 rounded-full border border-gray-300 flex-shrink-0" />
                                        )}
                                        <span className={cn("font-medium", req.met ? "text-green-700" : "text-gray-500")}>
                                            {req.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-3">
                            <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">비밀번호 확인</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="비밀번호 재입력"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={cn(
                                        "pr-10 h-12 text-base transition-all",
                                        formData.confirmPassword && !isMatch ? "border-red-200 focus:ring-red-500/20" : "",
                                        isMatch ? "border-green-200 focus:ring-green-500/20 focus:border-green-500" : ""
                                    )}
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </Button>
                            </div>
                            {formData.confirmPassword && !isMatch && (
                                <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                                    <AlertCircle className="w-3 h-3" />
                                    비밀번호가 일치하지 않습니다.
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className={cn(
                                "w-full h-12 text-lg font-bold gap-2 transition-all duration-300",
                                canSubmit
                                    ? "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300"
                            )}
                            disabled={!canSubmit || isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>변경 중...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    <span>비밀번호 변경하기</span>
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
