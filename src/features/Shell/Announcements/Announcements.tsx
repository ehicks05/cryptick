import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
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
			{ANNOUNCEMENTS.map((announcement, i) => (
				<div key={announcement.id}>
					<AnnouncementItem announcement={announcement} />
					{i < ANNOUNCEMENTS.length - 1 && (
						<div className="h-8">
							<div className="h-8 w-0.5 ml-2.75 bg-muted" />
						</div>
					)}
				</div>
			))}
		</div>
	</div>
);

export const AnnouncementsDialog = () => {
	return (
		<Dialog modal>
			<DialogTrigger
				render={
					<Button variant="outline" size="icon">
						<Bell />
					</Button>
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Announcements</DialogTitle>
					<DialogDescription>and recent changes</DialogDescription>
				</DialogHeader>

				<Announcements />

				<DialogFooter>
					<DialogClose render={<Button variant="outline">Close</Button>} />
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
