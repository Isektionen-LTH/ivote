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
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var rxjs_1 = require('rxjs');
var model_1 = require('./model');
var Api = (function () {
    function Api(http) {
        this.http = http;
    }
    Api.prototype.currentVote = function (code) {
        return this.http
            .get("http://10.3.5.240:8080/client/currentvote?id=" + code)
            .map(function (r) { return r.json().data; })
            .catch(function (error) {
            var vote = {
                title: 'Överphös',
                options: ['Adhara', 'Bracco'].map(function (name) { return new model_1.Option(name); }),
                selected: null
            };
            return rxjs_1.Observable.create(vote);
        });
    };
    Api = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], Api);
    return Api;
}());
exports.Api = Api;
//# sourceMappingURL=api.service.js.map