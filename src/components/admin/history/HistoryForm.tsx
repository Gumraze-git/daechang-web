'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

export interface HistoryEvent {
    id: string;
    month: string; // '01', '02', ..., '12'
    description: string;
}

export interface HistoryYear {
    id: string;
    year: string; // '2025'
    events: HistoryEvent[];
}

interface HistoryFormProps {
    initialData?: HistoryYear;
    onSubmit: (data: HistoryYear) => void;
    onCancel: () => void;
    existingYears?: string[]; // To validation duplicate years if needed
}

export default function HistoryForm({ initialData, onSubmit, onCancel, existingYears = [] }: HistoryFormProps) {
    const [year, setYear] = useState(initialData?.year || '');
    const [events, setEvents] = useState<HistoryEvent[]>(
        initialData?.events || [{ id: Date.now().toString(), month: '', description: '' }]
    );
    const [error, setError] = useState<string | null>(null);

    const handleAddEvent = () => {
        if (events.length >= 5) {
            setError('한 연도에 최대 5개의 연혁만 등록할 수 있습니다.');
            return;
        }
        setEvents([...events, { id: Date.now().toString(), month: '', description: '' }]);
        setError(null);
    };

    const handleRemoveEvent = (id: string) => {
        if (events.length === 1) {
            // Option: Don't allow deleting the last one, or just clear it.
            // Let's allow deleting, but maybe warn if trying to submit empty?
            setEvents(events.filter(e => e.id !== id));
        } else {
            setEvents(events.filter(e => e.id !== id));
        }
        setError(null);
    };

    const handleEventChange = (id: string, field: keyof HistoryEvent, value: string) => {
        setEvents(events.map(e => e.id === id ? { ...e, [field]: value } : e));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!year.trim()) {
            setError('연도를 입력해주세요.');
            return;
        }
        if (!initialData && existingYears.includes(year.trim())) {
            setError('이미 등록된 연도입니다.');
            return;
        }

        // Filter out empty events or validate them
        const validEvents = events.filter(e => e.month.trim() && e.description.trim());

        if (validEvents.length === 0) {
            setError('최소 1개의 유효한 연혁(월, 내용)을 입력해주세요.');
            return;
        }

        if (validEvents.length > 5) {
            setError('한 연도에 최대 5개의 연혁만 등록할 수 있습니다.');
            return;
        }

        onSubmit({
            id: initialData?.id || Date.now().toString(),
            year: year.trim(),
            events: validEvents.sort((a, b) => b.month.localeCompare(a.month)) // Sort by month descending
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="year">연도</Label>
                <Input
                    id="year"
                    placeholder="예: 2025"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="max-w-[200px]"
                    maxLength={4}
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label>연혁 상세 (최대 5개)</Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddEvent}
                        disabled={events.length >= 5}
                        className="gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        추가
                    </Button>
                </div>

                {error && (
                    <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                        <span className="font-medium">오류!</span> {error}
                    </div>
                )}

                <div className="space-y-3">
                    {events.map((event, index) => (
                        <Card key={event.id}>
                            <CardContent className="p-4 flex gap-4 items-start">
                                <div className="space-y-2 w-[100px] flex-shrink-0">
                                    <Label htmlFor={`month-${event.id}`} className="text-xs text-gray-500">월 (01~12)</Label>
                                    <Input
                                        id={`month-${event.id}`}
                                        placeholder="01"
                                        value={event.month}
                                        onChange={(e) => handleEventChange(event.id, 'month', e.target.value)}
                                        maxLength={2}
                                    />
                                </div>
                                <div className="space-y-2 flex-1">
                                    <Label htmlFor={`desc-${event.id}`} className="text-xs text-gray-500">내용</Label>
                                    <Input
                                        id={`desc-${event.id}`}
                                        placeholder="내용을 입력하세요"
                                        value={event.description}
                                        onChange={(e) => handleEventChange(event.id, 'description', e.target.value)}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="mt-6 text-gray-400 hover:text-red-500"
                                    onClick={() => handleRemoveEvent(event.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
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
