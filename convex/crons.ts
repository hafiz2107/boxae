import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

crons.interval('clear trash', { minutes: 1 }, internal.files.clearTrash);

export default crons;
