import { NestMiddleware, BadRequestException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

export class UserIdCheckMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params

        if (!id || isNaN(Number(id)) || Number(id) <= 0) {
            throw new BadRequestException(`Id Inválido!`)
        }

        next()
    }
}