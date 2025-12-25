'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface HistoryItem {
    id: string;
    year: string;
    month: string;
    day: string;
    description: string;
}

interface HistoryFormProps {
    initialData?: HistoryItem;
    onSubmit: (data: HistoryItem) => void;
    onCancel: () => void;
}

export default function HistoryForm({ initialData, onSubmit, onCancel }: HistoryFormProps) {
    const [year, setYear] = useState(initialData?.year || '');
    const [month, setMonth] = useState(initialData?.month || '');
    const [day, setDay] = useState(initialData?.day || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!year.trim()) {
            setError('연도를 입력해주세요.');
            return;
        }

        const yearRegex = /^(19|20)\d{2}$/;
        if (!yearRegex.test(year.trim())) {
            setError('유효한 4자리 연도(예: 1990, 2024)를 입력해주세요.');
            return;
        }

        if (!month.trim()) {
            setError('월을 입력해주세요.');
            return;
        }

        const m = parseInt(month, 10);
        if (isNaN(m) || m < 1 || m > 12) {
            setError('월은 01부터 12 사이의 숫자만 입력 가능합니다.');
            return;
        }

        if (day.trim()) {
            const d = parseInt(day, 10);
            if (isNaN(d) || d < 1 || d > 31) {
                setError('일은 01부터 31 사이의 숫자만 입력 가능합니다.');
                return;
            }
        }

        if (!description.trim()) {
            setError('내용을 입력해주세요.');
            return;
        }

        onSubmit({
            id: initialData?.id || Date.now().toString(),
            year: year.trim(),
            month: month.trim().padStart(2, '0'),
            day: day.trim().padStart(2, '0'),
            description: description.trim()
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                    <span className="font-medium">오류!</span> {error}
                </div>
            )}

            <div className="flex gap-4 items-end">
                <div className="space-y-2 w-[100px]">
                    <Label htmlFor="year">연도</Label>
                    <Input
                        id="year"
                        placeholder="2025"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        maxLength={4}
                        className="text-center"
                    />
                </div>
                <div className="space-y-2 w-[70px]">
                    <Label htmlFor="month">월</Label>
                    <Input
                        id="month"
                        placeholder="01"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        maxLength={2}
                        className="text-center"
                    />
                </div>
                <div className="space-y-2 w-[70px]">
                    <Label htmlFor="day">일</Label>
                    <Input
                        id="day"
                        placeholder="01"
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        maxLength={2}
                        className="text-center"
                    />
                </div>
                <div className="space-y-2 flex-1">
                    <Label htmlFor="description">내용</Label>
                    <Input
                        id="description"
                        placeholder="내용을 입력하세요"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    취소
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                    {initialData ? '수정 완료' : '등록 완료'}
                </Button>
            </div>
        </form>
    );
}
