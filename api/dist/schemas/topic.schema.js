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
exports.TopicSchema = exports.Topic = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Topic = class Topic {
    title;
    userId;
    status;
    progress;
    tags;
    mindmap;
    versions;
    diff;
    audioUrls;
};
exports.Topic = Topic;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Topic.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Topic.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['pending', 'scraping', 'processing', 'done', 'error'], default: 'pending' }),
    __metadata("design:type", String)
], Topic.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Topic.prototype, "progress", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Topic.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Topic.prototype, "mindmap", void 0);
__decorate([
    (0, mongoose_1.Prop)([Object]),
    __metadata("design:type", Array)
], Topic.prototype, "versions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Topic.prototype, "diff", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Topic.prototype, "audioUrls", void 0);
exports.Topic = Topic = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Topic);
exports.TopicSchema = mongoose_1.SchemaFactory.createForClass(Topic);
//# sourceMappingURL=topic.schema.js.map