import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { LoginsvService } from '../services/loginsv.service';
import { postListModel } from '../models/post.modules';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-detail-post',
  templateUrl: './detail-post.component.html',
  styleUrls: ['./detail-post.component.css']
})
export class DetailPostComponent implements OnInit {
  postId!: number;
  post!: postListModel;
  formGroup!: FormGroup;
  visible: boolean = false;
  postModel: postListModel = new postListModel();
  fixpost: postListModel = new postListModel();
  attachmentUrl: string | undefined;
  selectedFile: File | undefined; // Thêm thuộc tính selectedFile vào DetailPostComponent
  downloadUrl: string | undefined;
  attachmentFileName: string | undefined;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginsvService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    const postId = localStorage.getItem('idContribution');
    if (postId) {
      this.loginService.getPostById(+postId).subscribe(
        (data: postListModel) => {
          this.post = data;
          this.downloadUrl = `https://localhost:7222/api/Contribution/${postId}/file`; // Set download URL
          this.loginService.getFileName(+postId).subscribe(
            fileName => {
              if (fileName !== null) {
                this.attachmentFileName = fileName; // Gán tên tệp tin vào biến attachmentFileName
                console.log(this.attachmentFileName);
              } else {
                // Xử lý khi fileName là null
              }
            },
            error => {
              console.error('Error fetching file name:', error);
            }
          );
          this.createForm();
          this.formGroup.patchValue({
            ContributionID: this.post.contributionId,
            title: this.post.title,
            submissionDate: this.post.submissionDate,
            closureDate: this.post.closureDate,
            content: this.post.content,
            selectedForPublication: this.post.selectedForPublication,
            commented: this.post.commented,
            likes: this.post.likes,
            dislikes: this.post.dislikes,
            views: this.post.views,
            userID: this.post.userID,
            facultyID: this.post.facultyID,
            status: this.post.status,
            filename: this.downloadUrl,
            
          });
          console.log(this.downloadUrl)
        },
        error => {
          console.error('Error fetching post details:', error);
        }
      );
    }
  }
  deletePost(): void {
    const Id = localStorage.getItem('idContribution');
    if (Id !== null && confirm('Are you sure you want to delete this post?')) {
      this.loginService.deletePost(+Id).subscribe(
        () => {
          this.router.navigate(['/home']);
        },
      );
    }  
  }
  
  updatePost(): void {
      const postId = localStorage.getItem('idContribution');
      if (!postId || isNaN(+postId) || +postId <= 0) {
        console.error('Invalid ContributionID');
        return;
      }
      const formData = new FormData();
      formData.append('contributionID', postId);
      formData.append('title', this.formGroup.get('title')?.value);
      formData.append('submissionDate', this.formGroup.get('submissionDate')?.value);
      formData.append('closureDate', this.formGroup.get('closureDate')?.value);
      formData.append('content', this.formGroup.get('content')?.value);
      formData.append('selectedForPublication', String(this.postModel.selectedForPublication));
      formData.append('commented', String(this.postModel.commented));
      formData.append('likes', '1');
      formData.append('dislikes', '1');
      formData.append('views', '1');
      formData.append('userID', '40b6bc9d-ba7f-4ad9-9a89-cd0d62ef94d4');
      formData.append('facultyID', '1');
      formData.append('status', String(this.postModel.status));
      if (this.selectedFile !== undefined) {
        // Nếu có, thêm tệp tin mới vào FormData
        formData.append('file', this.selectedFile, this.selectedFile.name);
      }
      formData.append('UploadedDocuments', ''); 
      // Thêm tên file vào FormData từ biến attachmentFileName
      formData.append('attachmentFileName', this.attachmentFileName || '');
      this.loginService.updatePost(+postId, formData).subscribe(
        () => {
          // Sau khi cập nhật thành công, gọi lại API để lấy dữ liệu cập nhật mới cho bài đăng
          this.loginService.getPostById(+postId).subscribe(
            (data: postListModel) => {
              this.post = data;
              // Cập nhật dữ liệu trên form với dữ liệu mới nhận được từ server
              this.formGroup.patchValue({
                title: this.post.title,
                submissionDate: this.post.submissionDate,
                closureDate: this.post.closureDate,
                content: this.post.content,
                selectedForPublication: this.post.selectedForPublication,
                commented: this.post.commented,
                likes: this.post.likes,
                dislikes: this.post.dislikes,
                views: this.post.views,
                userID: this.post.userID,
                facultyID: this.post.facultyID,
                status: this.post.status,
                
              })
              this.post = data;
            },
            error => {
              console.error('Error fetching post details:', error);
            }
          );
        },
        error => {
          console.error('Error updating post:', error);
        }
      );
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      title: [''],
      submissionDate: [''],
      closureDate: [''],
      content: ['']
    });
  }
  onFileSelected(event: any) {
    console.log('File selected:', event.target.files[0]);
    this.selectedFile = event.target.files[0];
    console.log('Selected file:', this.selectedFile);
  }

}
