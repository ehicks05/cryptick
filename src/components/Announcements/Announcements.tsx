import { Bell } from 'lucide-react';
import { Button } from '../ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { ANNOUNCEMENTS, type Announcement } from './constants';

interface Props {
	announcement: Announcement;
}

const AnnouncementItem = ({ announcement: { date, text, Icon } }: Props) => {
	return (
		<div className="flex items-center gap-2">
			<div>{Icon}</div>
			<div>
				<div className="text-xs text-muted-foreground">
					{date.toLocaleDateString()}
				</div>
				<div>{text}</div>
			</div>
		</div>
	);
};

const Announcements = () => (
	<div className="flex flex-col items-start gap-8 overflow-y-auto">
		<div>
			<DialogTitle>Announcements</DialogTitle>
		</div>

		<div>
			{ANNOUNCEMENTS.map((announcement, i) => (
				<div key={announcement.id}>
					<AnnouncementItem announcement={announcement} />
					{i < ANNOUNCEMENTS.length - 1 && (
						<div className="h-8">
							<div className="h-8 w-0.5 ml-[11px] bg-muted" />
						</div>
					)}
				</div>
			))}
		</div>

		<DialogClose asChild>
			<Button variant="secondary">Close</Button>
		</DialogClose>
	</div>
);

export const AnnouncementsDialog = () => {
	return (
		<Dialog modal>
			<DialogTrigger asChild>
				<Button variant="outline" size="icon">
					<Bell />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<div>
					<Announcements />
				</div>
			</DialogContent>
		</Dialog>
	);
};
