import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  Response,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Param,
} from "@nestjs/common";
import { AnyFilesInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { AdminDto } from "./dtos/admin.dto";
import { BanDto } from "./dtos/ban.dto";
import {
  ChangeEmailDto,
  ChangeFirstnameDto,
  ChangeLastnameDto,
  ChangeNumberDto,
  ChangePasswordDto,
  ChangeUsernameDto,
} from "./dtos/change.dto";
import { DeAdminDto } from "./dtos/deAdmin.dto";
import { LoginDto } from "./dtos/login.dto";
import { SearchAdminsDto } from "./dtos/searchAdmins.dto";
import { SignupDto } from "./dtos/signup.dto";
import { UploadAvatarDto } from "./dtos/uploadAvatar.dto";
import { WhoAmIDto } from "./dtos/whoAmI.dto";
// import { avatarGuard } from './guards/avatar.guard';
import { AdminGuard } from "./guards/admin.guard";
import { GodGuard } from "./guards/god.guard";
import { UserGuard } from "./guards/user.guard";
// import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { AuthenticationService } from "./services/authentication.service";
import { UsersService } from "./services/users.service";
import { AuthGuard } from "@nestjs/passport";
import { CheckRecaptchaDto } from "./dtos/checkRecaptcha.dto";
import { ForgotPasswordDto } from "./dtos/forgotPassword.dto";
import { SetForgottonPasswordDto } from "./dtos/setForgottonPassword.dto";
import { ConfirmEmailDto } from "./dtos/confirmEmail.dto";

@Controller("users")
export class UsersController {
  constructor(
    private authenticationService: AuthenticationService,
    public usersService: UsersService
  ) {}

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return await this.authenticationService.login(loginDto);
  }

  @Post("signup")
  async signup(@Body() signupDto: SignupDto) {
    return this.authenticationService.signup(signupDto);
  }

  @UseGuards(UserGuard)
  @Post("whoAmI")
  async whoAmI(@Request() req) {
    return this.authenticationService.whoAmI(req.user);
  }

  @UseGuards(UserGuard)
  @Post("account-details")
  async accountDetails(@Request() req) {
    const { id } = req.user;
    return await this.usersService.accountDetails(id);
  }

  //   @UseGuards(JwtAuthGuard)
  //   @UseGuards(avatarGuard)
  // im tired of trying , ill do the auth stuff in the service itself
  // body cant be manipulated here
  @UseInterceptors(
    FileInterceptor("file", {
      dest: "./cdn",
    })
  )
  @Post("uploadAvatar")
  async uploadAvatar(
    @UploadedFile() avatar,
    @Body() uploadAvatarDto: UploadAvatarDto
  ) {
    let { accessToken } = uploadAvatarDto;
    return this.usersService.uploadAavatar(avatar, accessToken);
  }

  @UseGuards(UserGuard)
  @Post("changeUsername")
  async changeUsername(
    @Body() changeUsernameDto: ChangeUsernameDto,
    @Request() req
  ) {
    const { id, username } = req.user;
    await this.usersService.changeUsername(changeUsernameDto, id, username);
  }

  @UseGuards(UserGuard)
  @Post("changeEmail")
  async changeEmail(@Body() changeEmailDto: ChangeEmailDto, @Request() req) {
    const { id } = req.user;
    await this.usersService.changeEmail(changeEmailDto, id);
  }

  @UseGuards(UserGuard)
  @Post("changePassword")
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req
  ) {
    const { id } = req.user;
    await this.usersService.changePassword(changePasswordDto, id);
  }

  @UseGuards(UserGuard)
  @Post("changeFirstname")
  async changeFirstname(
    @Body() changeFirstnameDto: ChangeFirstnameDto,
    @Request() req
  ) {
    const { id } = req.user;
    await this.usersService.changeFirstname(changeFirstnameDto, id);
  }

  @UseGuards(UserGuard)
  @Post("changeLastname")
  async changeLastname(
    @Body() chagneLastnameDto: ChangeLastnameDto,
    @Request() req
  ) {
    const { id } = req.user;
    await this.usersService.changeLastname(chagneLastnameDto, id);
  }

  @UseGuards(UserGuard)
  @Post("changeNumber")
  async changeNumber(@Body() chagneNumberDto: ChangeNumberDto, @Request() req) {
    const { id } = req.user;
    await this.usersService.changeNumber(chagneNumberDto, id);
  }

  @UseGuards(GodGuard)
  @Post("listAdmins")
  async listAdmins() {
    return await this.usersService.listAdmins();
  }

  @UseGuards(GodGuard)
  @Patch("deAdmin")
  async deAdmin(@Body() deAdminDto: DeAdminDto) {
    return await this.usersService.deAdmin(deAdminDto.id);
  }

  @UseGuards(GodGuard)
  @Patch("admin")
  async admin(@Body() adminDto: AdminDto) {
    return await this.usersService.admin(adminDto.id);
  }

  @UseGuards(GodGuard)
  @Patch("ban")
  async ban(@Body() banDto: BanDto) {
    return await this.usersService.ban(banDto.id);
  }

  // admins search for the posts they have created
  @UseGuards(GodGuard)
  @Post("adminsSearch")
  async searchAdmins(@Body() searchAdminsDto: SearchAdminsDto) {
    return await this.usersService.searchAdmins(searchAdminsDto.name);
  }

  @UseGuards(AdminGuard)
  @Post("logsList")
  async logsList() {
    return await this.usersService.logsList();
  }

  @UseGuards(AuthGuard("google"))
  @Get("google")
  async googleAuth() {
    return {};
  }

  @UseGuards(AuthGuard("google"))
  @Get("googleRedirect")
  async googleRedirect(@Request() req, @Response() res) {
    res.redirect(
      `${process.env.CLIENT_ADDRESS}#/panel/registeration/login?googleAuth=${req.user}`
    );
  }

  @Post("checkRecaptcha")
  async checkRecaptcha(@Body() checkRecaptchaDto: CheckRecaptchaDto) {
    return await this.usersService.checkRecaptcha(checkRecaptchaDto.token);
  }

  @Post("forgotPassword")
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.usersService.forgotPassword(forgotPasswordDto.email);
  }

  @Post("setForgottonPassword")
  async setforgotonPassword(
    @Body() setForgottonPasswordDto: SetForgottonPasswordDto
  ) {
    return await this.usersService.setForgottonPassword(
      setForgottonPasswordDto.token,
      setForgottonPasswordDto.password
    );
  }

  // @UseGuards(UserGuard)
  // validation is done inside service
  @Get("emailConfirm/:at")
  async getConfirmEmail(@Param("at") accessToken: string) {
    return await this.usersService.getConfirmEmail(accessToken);
  }

  @UseGuards(UserGuard)
  @Post("emailConfirm")
  async confrimEmail(@Body() confirmEmailDto: ConfirmEmailDto, @Request() req) {
    const { username, id } = req.user;
    return await this.usersService.confirmEmail(id, confirmEmailDto.key);
  }
}
