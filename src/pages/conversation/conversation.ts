import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {UserService} from "../../services/user";
import {AuthService} from "../../services/auth";
import {User} from "../../interfaces/user";
import {ConversationService} from "../../services/conversation";

/**
 * Generated class for the ConversationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-conversation',
  templateUrl: 'conversation.html',
})
export class ConversationPage {
  friend: User;
  user: User;
  ids: any[] = [];
  message: string = '';
  conversation: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserService, public authService: AuthService, public conversationService: ConversationService) {
    this.friend = this.navParams.get('data');
    this.authService.getStatus().subscribe((result) => {
      this.userService.getById(result.uid).valueChanges().subscribe((user: User) => {
        this.user = user;
        this.ids = [this.user.uid, this.friend.uid].sort();
        this.getConversation();
      })
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConversationPage');
  }
  sendMessage() {
    const messageObject: any = {
      uid: this.ids.join('||'),
      timestamp: Date.now(),
      sender: this.user.uid,
      receiver: this.friend.uid,
      type: 'text',
      content: this.message.replace(/\n$/, '')
    };
    this.conversationService.add(messageObject).then(() => {
    });
    this.message = '';
  }
  getConversation() {
    this.conversationService.getById(this.ids.join('||')).valueChanges().subscribe((data) => {
      this.conversation = data;
    }, (error) => {
      console.log(error);
    });
  }
  getUserNickById(id) {
    if (id === this.friend.uid) {
      return this.friend.nick;
    } else if (id === this.user.uid) {
      return this.user.nick;
    }
  }
}
