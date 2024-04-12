import { Component, ElementRef, OnInit } from '@angular/core';
import { commentModel, postListModel } from '../models/post.modules';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginsvService } from '../services/loginsv.service';
import { createFocusTrap } from 'focus-trap';
@Component({
  selector: 'app-show-post',
  templateUrl: './show-post.component.html',
  styleUrls: ['./show-post.component.css']
})
export class ShowPostComponent implements OnInit {
dongGopTheoTungKhoa: any;
dongGopPhoBienNhat: any;
dongGopMoiNhat: any;

exportExcel() {
throw new Error('Method not implemented.');
}
  tg!: number;
  titleDialog: string | undefined;
  idcmt! : number;
  listCheckDongGopPhoBienNhat: {}[] | undefined;
  timeToSearchList: {}[] | undefined;
filterGlobal: any;
doComt(arg0: number) {
throw new Error('Method not implemented.');
}
  postList: postListModel[] = [];
  commentList!: commentModel[];
  loggedInUser: string | null;
  post: postListModel;
  private focusTrap: any;
  postId!: number;
  likedPosts: Set<number> = new Set<number>();
  dislikedPosts: Set<number> = new Set<number>();
  visible: boolean = false;
  isLiked: boolean = false;
  isDisliked: boolean = false;
  editingCommentId: number | null = null;
  editedCommentContent: string = '';
  likedPostsMap: Map<number, boolean> = new Map<number, boolean>();
  originalPostList: postListModel[] = [];
commentWord: any;
  constructor(
    private loginsvService: LoginsvService,
    private route: ActivatedRoute,
    private router: Router,
    private elementRef: ElementRef
  ) {
    this.loggedInUser = this.loginsvService.getLoggedInUser();
    this.post = new postListModel();
    this.listCheckDongGopPhoBienNhat = [
      { field: 'likes', header: 'Like max', textAlign: 'left', display: 'table-cell', width: "145px" },
      { field: 'disLikes', header: 'DisLike max', textAlign: 'left', display: 'table-cell', width: "145px" },
      { field: 'view', header: 'View Max', textAlign: 'left', display: 'table-cell', width: "145px" },
    ]
    this.timeToSearchList = [
      { field: '1', header: '1 Day', textAlign: 'left', display: 'table-cell', width: "145px" },
      { field: '10', header: '10 Day', textAlign: 'left', display: 'table-cell', width: "145px" },
      { field: '15', header: '15 Day', textAlign: 'left', display: 'table-cell', width: "145px" },
    ]
  }
  innerWidth: number = 0; //number window size first
  isShowFilterTop: boolean = false;
  isShowFilterLeft: boolean = false;
  leftColNumber: number = 12;
  rightColNumber: number = 0;
  colSumarySection: number = 4;

  showFilter() {
    if (this.innerWidth < 1024) {
      this.isShowFilterTop = !this.isShowFilterTop;
    } else {
      this.isShowFilterLeft = !this.isShowFilterLeft;
      if (this.isShowFilterLeft) {
        this.leftColNumber = 9;
        this.rightColNumber = 3;
        this.colSumarySection = 6;
      } else {
        this.leftColNumber = 12;
        this.rightColNumber = 0;
        this.colSumarySection = 4;
      }
    }
  }


  ngOnInit() {
    
    this.getMasterData(); 
    const element = this.elementRef.nativeElement.querySelector('.p-dialog-content');
    this.focusTrap = createFocusTrap(element, { escapeDeactivates: false });
    this.focusTrap.activate();
    const savedLikedPosts = localStorage.getItem('likedPostsMap');
    if (savedLikedPosts !== null) {
        this.likedPostsMap = new Map<number, boolean>(JSON.parse(savedLikedPosts));
    }
  }

  getMasterData() {
    this.loginsvService.getPost().subscribe(
      (data) => {
        this.originalPostList = data.map((post) => ({ ...post }));
        this.postList = [...this.originalPostList]; // Sao chép dữ liệu gốc sang mảng khác để tránh tham chiếu
        console.log("postList:", this.postList);
      },
      (error) => {
        console.error(error);
      }
    );
    //console.log(this.postList); 
  }
  fetchPostDetails(id: number): void {
    if (id !== undefined) {
      localStorage.setItem('idContribution', id.toString());
      console.log("gyhggth",localStorage.getItem('idContribution'));
      this.router.navigateByUrl(`/detailContribution/`+id);
      this.loginsvService.getPostById(id).subscribe(post => {
        this.post = post;
      });
    } 
    else {
      console.error("ID is undefined");
    }
  }
  doLike(id: number, isContribution: boolean) {
    const idToLikeComponent = new FormData();
    idToLikeComponent.append('id', '' + id);
    idToLikeComponent.append('isContribution', isContribution.toString());
    this.loginsvService.getLike(idToLikeComponent,isContribution).subscribe(like => {
      this.getMasterData();
      this.likedPostsMap.set(id, true);
      this.dislikedPosts.delete(id); // Xóa khỏi dislikedPostsMap nếu người dùng đã dislike trước đó
      this.saveLikeState();
    });
  }
  
  doDislike(id: number, isContribution: boolean) {
    const idToDislikeComponent = new FormData();
    idToDislikeComponent.append('id', '' + id)
    idToDislikeComponent.append('isContribution', isContribution.toString());
    this.loginsvService.getdisLike(idToDislikeComponent,isContribution).subscribe(dislike => {
        this.getMasterData();
        this.likedPostsMap.delete(id); // Xóa khỏi likedPostsMap nếu người dùng đã like trước đó
        this.dislikedPosts.add(id);
        this.saveLikeState();
    });
  }
  getComt(id: number,title:string) {
    this.visible = true;
    this.tg=id;
    this.titleDialog = title;
    console.log("idcommet", id)
    this.loginsvService.getComment(id).subscribe(cmt => {
        this.commentList = cmt;
        console.log("commetlisst", this.commentList);
  });
}

  postComt(content: string) {
    debugger;
    const contributionId = this.tg;
    const currentDate = new Date();
    const formattedDateString = currentDate.toISOString();
    const userId = localStorage.getItem('userId') ?? '';
    const postForm = new FormData();
    postForm.append("ContributionId", contributionId.toString());
    postForm.append("Content", content);
    postForm.append("UserId", userId ); 
    console.log(userId);
    this.loginsvService.postComment(postForm).subscribe({
      next: (response: any) => {
        console.log('Comment posted successfully:', response);
        this.getComt(contributionId,response.title);
        // Sau khi comment được post thành công, gọi hàm để load lại danh sách comment
      },
      error: (error: any) => {
        console.error('Error while submitting post:', error);
        // Xử lý lỗi ở đây nếu cần thiết
      }
    });
    this.commentWord = null;
  }
  deleteComment(id: number): void {
    console.log(id);
    this.loginsvService.deleteComment(id).subscribe(
      () => {
        console.log('Comment deleted successfully');
        if (this.titleDialog) {
          this.getComt(this.tg, this.titleDialog); 
        } else {
          console.error('Title is undefined or empty');
        }
        error: (error: any) => {
          console.error('Error while submitting post:', error);
        }
      });
  }
  doDisLikeCmt(id: number, isContribution: boolean) {
    const idToLikeComponent = new FormData();
    idToLikeComponent.append('id', '' + id)
    this.loginsvService.getdisLike(idToLikeComponent, isContribution).subscribe(like => {
      console.log("like", like);
      this.getDataAfterLikeCmt(this.tg);
    });
  }
  doLikeCmt(id: number, isContribution: boolean) {
    const idToLikeComponent = new FormData();
    idToLikeComponent.append('id', '' + id)
    this.loginsvService.getLike(idToLikeComponent, isContribution).subscribe(like => {
      console.log("like", like);
      this.getDataAfterLikeCmt(this.tg);
    });
  }
  getDataAfterLikeCmt(id: number) {
    this.loginsvService.getComment(id).subscribe(cmt => {
      this.commentList = cmt;
      console.log("commetlisst", this.commentList);
    });
  }
  saveLikeState() {
    const likedPostsObject = Object.fromEntries(this.likedPostsMap);
    localStorage.setItem('likedPostsMap', JSON.stringify(likedPostsObject));
  }
  startEditComment(id: number, content: string) {
    this.editingCommentId = id;
    this.editedCommentContent = content;
  }
  saveEditedComment(commentId: number, newContent: string) {
    if (newContent.trim() === '') {
      return; // Bỏ qua nếu nội dung sửa chưa nhập
    }
  
    const formData = new FormData();
    const userId = localStorage.getItem('userId') ?? '';
    const currentDate = new Date(); // Lấy ngày hiện tại
    const isAnonymous = true; // Đặt isAnonymous mặc định là true
    formData.append('CommentId', '' + commentId);
    formData.append('UserId', userId);
    formData.append('Content', newContent);
    formData.append('Date', currentDate.toISOString()); // Chuyển đổi ngày thành chuỗi ISO
    formData.append('isAnonymous', isAnonymous.toString());
    
    this.loginsvService.editComment(commentId, formData).subscribe({
      next: (response: any) => {
        console.log('Comment edited successfully:', response);
        if (this.titleDialog) {
          this.getComt(this.tg, this.titleDialog); 
          //this.getDataAfterLikeCmt(this.tg);
        } else {
          console.error('Title is undefined or empty');
        } // Load lại danh sách comment sau khi chỉnh sửa
      },
      error: (error: any) => {
        console.error('Error while editing comment:', error);
        // Xử lý lỗi ở đây nếu cần thiết
      }
    });
    this.cancelEditComment(); // Kết thúc việc chỉnh sửa comment sau khi đã lưu
  }
  //this.cancelEditComment();
  cancelEditComment() {
    this.editingCommentId = null;
    this.editedCommentContent = '';
  }
  search() {
    let filteredList = this.originalPostList;
    if (this.dongGopPhoBienNhat) {
      const filterField = this.dongGopPhoBienNhat.field;
      let maxLikes = 0;
      let maxDislikes = 0;
      let maxViews = 0;
  
      if (filterField === 'likes') {
        this.originalPostList.forEach(item => { if (item.likes > maxLikes) { maxLikes = item.likes } });
        filteredList = this.originalPostList.filter(i => i.likes == maxLikes);
      } else if (filterField === 'disLikes') {
        this.originalPostList.forEach(item => { if (item.dislikes > maxDislikes) { maxDislikes = item.dislikes } });
        filteredList = this.originalPostList.filter(i => i.dislikes == maxDislikes);
      } else if (filterField === 'views') {
        this.originalPostList.forEach(item => { if (item.views > maxViews) { maxViews = item.views } });
        filteredList = this.originalPostList.filter(i => i.views == maxViews);
      }
    }
    if (this.dongGopMoiNhat) {
      const filterDate = this.dongGopMoiNhat.field;
  
      if (filterDate === '1' || filterDate === '10' || filterDate === '15') {
        // Lọc theo tiêu chí ngày nộp
        const currentDate = new Date();
        const cutoffDate = new Date(currentDate);
        cutoffDate.setDate(cutoffDate.getDate() - parseInt(filterDate)); // Tính ngày cắt dựa trên filterDate
  
        filteredList = filteredList.filter(item => {
          const submissionDate = new Date(item.submissionDate);
          return submissionDate >= cutoffDate && submissionDate <= currentDate;
        });
      }
    }
    this.postList = filteredList;
  }
} 

