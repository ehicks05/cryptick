import { cn } from 'lib/utils';
import type { Direction } from 'types';

type DirectionalStyle = Record<Direction, string>;

export const STROKE: DirectionalStyle = {
	POS: 'stroke-green-500 dark:stroke-green-500',
	NEG: 'stroke-red-400 dark:stroke-red-500',
	UNK: 'stroke-neutral-500 dark:stroke-neutral-400',
};

export const BG_GRADIENTS = {
	POS: cn(
		'from-[rgba(60,120,60,.08)]',
		'via-[rgba(60,120,60,.08)]',
		'to-[rgba(60,120,60,.01)]',
		'via-[40%]',
		'to-[70%]',
		'dark:from-[rgba(60,120,60,.15)]',
		'dark:via-[rgba(60,120,60,.1)]',
		'dark:to-[rgba(60,120,60,.1)]',
	),
	NEG: cn(
		'from-[rgba(150,60,60,.08)]',
		'via-[rgba(150,60,60,.08)]',
		'to-[rgba(150,60,60,.01)]',
		'via-[40%]',
		'to-[70%]',
		'dark:from-[rgba(150,60,60,.15)]',
		'dark:via-[rgba(150,60,60,.1)]',
		'dark:to-[rgba(150,60,60,.1)]',
	),
	UNK: cn(
		'from-[rgba(90,90,90,.15)]',
		'via-[rgba(90,90,90,.1)]',
		'to-[rgba(90,90,90,.08)]',
		'via-[40%]',
		'to-[70%]',
		'dark:from-[rgba(90,90,90,.15)]',
		'dark:via-[rgba(90,90,90,.1)]',
		'dark:to-[rgba(90,90,90,.08)]',
	),
} as const;

export const BG_SOLIDS = {
	POS: cn('bg-[rgba(60,120,60,.12)]', 'dark:bg-[rgba(60,120,60,.15)]'),
	NEG: cn('bg-[rgba(150,60,60,.12)]', 'dark:bg-[rgba(150,60,60,.15)]'),
	UNK: cn('bg-[rgba(90,90,90,.15)]', 'dark:bg-[rgba(90,90,90,.15)]'),
} as const;

export const BORDER_COLORS = {
	POS: cn('border-[rgba(60,120,60,.12)]', 'dark:border-[rgba(60,120,60,.15)]'),
	NEG: cn('border-[rgba(150,60,60,.12)]', 'dark:border-[rgba(150,60,60,.15)]'),
	// POS: 'border-green-200 dark:border-green-950',
	// NEG: 'border-red-200 dark:border-red-950',
	UNK: 'border-neutral-200 dark:border-neutral-800',
} as const;

export const TEXT_COLORS = {
	POS: 'text-green-700 dark:text-green-500',
	NEG: 'text-red-600 dark:text-red-500',
	UNK: 'text-neutral-600 dark:text-neutral-500',
} as const;
