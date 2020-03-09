<?php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;


class ProgressResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            "id" => $this->string_id,
            "level_id" => $this->level_id,
        ];
    }
}
