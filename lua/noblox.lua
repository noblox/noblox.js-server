local HttpService = game:GetService("HttpService")

local CONFIGURATION = {
	DOMAIN = "http://xxx.xxx.xxx.xxx:3000";
	API_TOKEN = "";
	DEFAULT_GROUP_ID = 0000000;
}

local ROUTES = {
	GET_USERNAME_FROM_ID = "/get-username-from-id/%s";
	GET_ID_FROM_USERNAME = "/get-id-from-username/%s";
	USER_INFO = "/user/%s";
	GROUP_HANDLE_JOIN_REQUEST = "/group/%s/handle-join-request";
	GROUP_SHOUT = "/group/%s/shout";
	GROUP_EXILE = "/group/%s/member/%s";
	GROUP_SET_RANK = "/group/%s/member/%s/rank";
	GROUP_CHANGE_RANK = "/group/%s/member/%s/rank-change"
}

local Noblox = {
	Group = {};
	User = {};
}

function generateHeader(includeContentType: boolean) : table
	return {
		["Authorization"] = CONFIGURATION.API_TOKEN,
		["Content-Type"] = includeContentType and "application/json" or ""
	}
end
	
function generateURL(route, ...) : string
	return string.format(CONFIGURATION.DOMAIN .. route, ...)
end


function Noblox.Group.Shout(groupId: number, message: string)
	if not groupId then
		groupId = CONFIGURATION.DEFAULT_GROUP_ID
	end

	local payload = {
		["message"] = message
	}

	local response
	local success, err = pcall(function()
		response = HttpService:RequestAsync({
			Url = generateURL(ROUTES.GROUP_SHOUT, groupId),
			Method = "POST",
            Body = HttpService:JSONEncode(payload),
			Headers = generateHeader(true)
		})
	end)

    if success then
		if response.StatusCode == 200 then
			return HttpService:JSONDecode(response.Body)
		else
			return false, HttpService:JSONDecode(response.Body).message
		end
	else
		return false, err
	end
end

function Noblox.Group.HandleJoinRequest(groupId: number, userId: number, accept: boolean)
	if not groupId then
		groupId = CONFIGURATION.DEFAULT_GROUP_ID
	end
	if not userId then
		error("Missing userId on Groups.HandleJoinRequest()")
	end
	if not accept then
		error("Missing accept on Groups.HandleJoinRequest()")
	end

	local payload = {
		["target"] = userId,
		["accept"] = accept
	}

	local response
	local success, err = pcall(function()
		response = HttpService:RequestAsync({
			Url = generateURL(ROUTES.GROUP_HANDLE_JOIN_REQUEST, groupId),
			Method = "POST",
            Body = HttpService:JSONEncode(payload),
			Headers = generateHeader(true)
		})
	end)

    if success then
		if response.StatusCode == 200 then
			return HttpService:JSONDecode(response.Body)
		else
			return false, HttpService:JSONDecode(response.Body).message
		end
	else
		return false, err
	end
end

function Noblox.Group.Exile(groupId: number, userId: number)
	if not groupId then
		groupId = CONFIGURATION.DEFAULT_GROUP_ID
	end
	if not userId then
		error("Missing userId on Groups.Exile()")
	end

	local response
	local success, err = pcall(function()
		response = HttpService:RequestAsync({
			Url = generateURL(ROUTES.GROUP_EXILE, groupId, userId),
			Method = "DELETE",
			Headers = generateHeader(false)
		})
	end)
	
    if success then
		if response.StatusCode == 200 then
			return HttpService:JSONDecode(response.Body)
		else
			return false, HttpService:JSONDecode(response.Body).message
		end
	else
		return false, err
	end
end

function Noblox.Group.SetRank(groupId: number, userId: number, rankOrRole: number | string)
	if not groupId then
		groupId = CONFIGURATION.DEFAULT_GROUP_ID
	end
	if not userId then
		error("Missing userId on Groups.SetRank()")
	end
	if not rankOrRole then
		error("Missing rank or role on Groups.SetRank()")
	end

	local payload = {}
	
	if type(rankOrRole) == 'string' then
		payload['role'] = rankOrRole
	elseif type(rankOrRole) == 'number' then
		payload['rank'] = rankOrRole
	end

	local response
	local success, err = pcall(function()
		response = HttpService:RequestAsync({
			Url = generateURL(ROUTES.GROUP_SET_RANK, groupId, userId),
			Method = "POST",
            Body = HttpService:JSONEncode(payload),
			Headers = generateHeader(true)
		})
	end)

    if success then
		if response.StatusCode == 200 then
			return HttpService:JSONDecode(response.Body)
		else
			return false, HttpService:JSONDecode(response.Body).message
		end
	else
		return false, err
	end
end

function Noblox.Group.ChangeRank(groupId: number, userId: number, change: number)
	if not groupId then
		groupId = CONFIGURATION.DEFAULT_GROUP_ID
	end
	if not userId then
		error("Missing userId on Groups.ChangeRank()")
	end

	local payload = {
		["change"] = change
	}

	local response
	local success, err = pcall(function()
		response = HttpService:RequestAsync({
			Url = generateURL(ROUTES.GROUP_CHANGE_RANK, groupId, userId),
			Method = "POST",
            Body = HttpService:JSONEncode(payload),
			Headers = generateHeader(true)
		})
	end)

    if success then
		if response.StatusCode == 200 then
			return HttpService:JSONDecode(response.Body)
		else
			return false, HttpService:JSONDecode(response.Body).message
		end
	else
		return false, err
	end
end

function Noblox.User.GetInformation(userId: number)
	if not userId then
		error("Missing userId on User.GetInformation()")
	end

	local response
	local success, err = pcall(function()
		response = HttpService:RequestAsync({
			Url = generateURL(ROUTES.USER_INFO, userId),
			Method = "GET",
			Headers = generateHeader(false)
		})
	end)

    if success then
		if response.StatusCode == 200 then
			return HttpService:JSONDecode(response.Body)
		else
			return false, HttpService:JSONDecode(response.Body).message
		end
	else
		return false, err
	end
end

return Noblox