import { SetMetadata } from '@nestjs/common';

export const IS_SKIP_RSP_FMT = 'isSkipResponseFormat';
export const SkipRspFmt = () => SetMetadata(IS_SKIP_RSP_FMT, true);
