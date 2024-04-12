import { Component, OnInit } from '@angular/core';
import { postListModel } from '../models/post.modules';
import { LoginsvService } from '../services/loginsv.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-contributed-article',
  templateUrl: './post-contributed-article.component.html',
  styleUrls: ['./post-contributed-article.component.css']
})
export class PostContributedArticleComponent implements OnInit {
  postModel: postListModel = new postListModel();
  selectedFile: File | undefined;
  constructor(
    private loginService: LoginsvService,
    private router: Router,
  ) {}

  ngOnInit() {
  }

  onSubmit() {
    // Tạo đối tượng Date cho submissionDate và closureDate
    const submissionDate = new Date(this.postModel.submissionDate);
    const closureDate = new Date(this.postModel.closureDate);
  
    // Chuyển đổi ngày thành chuỗi theo định dạng mong muốn
    const formattedSubmissionDate = submissionDate.toISOString();
    const formattedClosureDate = closureDate.toISOString();
  
    // Tiếp tục xử lý với các chuỗi đã định dạng
    const formData = new FormData();
    // formData.append('contributionID',String(this.postModel.contributionID));
    formData.append('title', this.postModel.title);
    formData.append('submissionDate', formattedSubmissionDate);
    formData.append('closureDate', formattedClosureDate);
    formData.append('content', this.postModel.content);
    formData.append('selectedForPublication', String(this.postModel.selectedForPublication));
    formData.append('commented', String(this.postModel.commented));
    formData.append('likes', '0');
    formData.append('dislikes', '0');
    formData.append('views', '0');
    formData.append('status', String(this.postModel.status));
    if (this.selectedFile) {
      formData.append('file', this.selectedFile); // Thêm trường file vào FormData
      // formData.append('UploadedDocuments', this.selectedFile); // Giữ lại trường UploadedDocuments (nếu cần)
    }
    formData.append('UploadedDocuments', '');
    console.log(this.selectedFile);
    this.loginService.postNewPost(formData).subscribe({
      next: (response: any) => {
        console.log(response);
        // Kiểm tra xem response có chứa id của bài đăng không
        console.log('Post submitted successfully.');
        // Điều hướng người dùng đến trang chi tiết của bài đăng mới được tạo
        this.router.navigateByUrl(`/home`);
        console.log('Navigated to detail page of the new post');
      },
    });
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
}
