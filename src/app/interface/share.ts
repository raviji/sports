export class Share {
    public constructor(
        public id: string,
        public when: Date,
        public courtFee: number,
        public courtPaidBy: string,
        public shuttleCost: number,
        public shuttleTookBy: string,
        public extraHours: boolean,
        public whoPlayed: Array<any[]>,
        public extraWhoPlayed: Array<any[]>,
        public extraCourtFee: number,
        public totalAmount:number
        ) {}
    }