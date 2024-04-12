export class postListModel{
    contributionId!: number;
    title!: string ;
    submissionDate: string = '';
    closureDate: string = '';
    content: string = '';
    selectedForPublication: boolean = true; 
    commented: boolean = true; 
    likes!: number; 
    dislikes!: number; 
    views!: number; 
    userID!: string;
    facultyID: number = 0;
    status: number = 0;
    fileName: string = '';
    isLiked: boolean = false; // New property to track if post is liked
    isDisliked: boolean = false; // New property to track if post is disliked
    id!: number;
}

export class commentModel {
    contributionId!: number;
    userId!: string;
    content!: string;
    date!: Date;
    id!: number;
    likes!: number;
    dislikes!:number;
    isAnonymous!: boolean;
}
export class Notification {
    notificationID!: number;
    userID!: string;
    notificationType!: number;
    contributionID!: number;
    content!: string;
    date!: Date;
}
