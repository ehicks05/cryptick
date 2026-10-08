import { cn } from 'cn';
import type { Direction } from '@/types';

type DirectionalStyle = Record<Direction, string>;

export const STROKE: DirectionalStyle = {
	POS: 'stroke-green-500 dark:stroke-green-500',
	NEG: 'stroke-red-400 dark:stroke-red-500',
	UNK: 'stroke-neutral-500 dark:stroke-neutral-400',
};

export const BG_SOLIDS = {
	POS: cn('bg-[rgba(60,120,60,.12)]', 'dark:bg-[rgba(60,120,60,.15)]'),
	NEG: cn('bg-[rgba(150,60,60,.12)]', 'dark:bg-[rgba(150,60,60,.15)]'),
	UNK: cn('bg-[rgba(90,90,90,.15)]', 'dark:bg-[rgba(90,90,90,.15)]'),
} as const;

export const TEXT_COLORS = {
	POS: 'text-green-700 dark:text-green-500',
	NEG: 'text-red-600 dark:text-red-500',
	UNK: 'text-neutral-600 dark:text-neutral-500',
} as const;
