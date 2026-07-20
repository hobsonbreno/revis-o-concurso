"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressSchema = exports.Progress = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Progress = class Progress {
    userId;
    topicId;
    topicTitle;
    studyMinutes;
    quizAttempts;
    quizCorrect;
    lastStudied;
    masteryLevel;
    nextReviewDate;
};
exports.Progress = Progress;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Progress.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, ref: 'Topic' }),
    __metadata("design:type", String)
], Progress.prototype, "topicId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Progress.prototype, "topicTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Progress.prototype, "studyMinutes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Progress.prototype, "quizAttempts", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Progress.prototype, "quizCorrect", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Progress.prototype, "lastStudied", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0, max: 1 }),
    __metadata("design:type", Number)
], Progress.prototype, "masteryLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Progress.prototype, "nextReviewDate", void 0);
exports.Progress = Progress = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Progress);
exports.ProgressSchema = mongoose_1.SchemaFactory.createForClass(Progress);
//# sourceMappingURL=progress.schema.js.map